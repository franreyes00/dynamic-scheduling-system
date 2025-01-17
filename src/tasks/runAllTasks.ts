
import type { Task } from './taskManager'; 
import { getTasks } from './taskManager';
const { sanitizeTasks }: { sanitizeTasks: (tasks: Task[]) => Task[] } = require('../utils/sanitizeTasks');
const { removeProblematicNode }: { removeProblematicNode: (tasks: Task[], problematicNodeId: number) => Task[] } = require('../utils/problematicNodeHandler');

export const runAllTasks = async (): Promise<void> => {
  console.log('[DEBUG] Starting runAllTasks...');

  // 1) Fetch the tasks and sanitize them to remove self-dependencies
  let tasks = getTasks();
  console.log('[DEBUG] Fetched tasks:', tasks);

  tasks = sanitizeTasks(tasks);
  console.log('[DEBUG] After sanitizeTasks:', tasks);

  // 2) Map to track task execution status
  //    executed: we have finalized this task (success or fail/skip) -- success:  true if it ran successfully, false if it failed or was forcibly skipped
  const taskStatus = new Map<number, { executed: boolean; success: boolean }>();
  tasks.forEach((task: Task) => taskStatus.set(task.id, { executed: false, success: false }));

  // 3) Sets to assist with cycle detection in each pass
  const visited = new Set<number>();
  const visiting = new Set<number>();

  const logExecution = (taskId: number, status: string) => {
    console.log(`Task ${taskId}: ${status}`);
  };

  const detectCycle = (taskId: number): boolean => {
    if (visiting.has(taskId)) {
      // Cycle discovered
      console.log(`[DEBUG][detectCycle] Task ${taskId} is in visiting set — cycle detected!`);
      logExecution(taskId, 'Skipped due to a cycle detected.');
      return true;
    }
    if (visited.has(taskId)) {
      // Already processed in this pass
      return false;
    }

    visiting.add(taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      for (const depId of task.dependencies) {
        if (detectCycle(depId)) {
          visiting.delete(taskId);
          return true;
        }
      }
    }
    visiting.delete(taskId);
    visited.add(taskId);
    return false;
  };

  const canExecute = (task: Task): boolean => {
    return task.dependencies.every(depId => {
      const depStatus = taskStatus.get(depId);
      // If a dependency is finalized but failed => can't run
      if (depStatus?.executed && !depStatus.success) return false;
      // If dependency not executed yet => not ready
      if (!depStatus?.executed) return false;
      return true;
    });
  };

  let madeProgress = true;
  while (madeProgress) {
    madeProgress = false;

    // We'll iterate over a snapshot of tasks because we might remove some nodes..
    for (const task of [...tasks]) {
      const status = taskStatus.get(task.id);
      if (!status) continue; // TODO: Edge case
      if (status.executed) {
        // Already finalized (either success or fail/skip)
        continue;
      }

      // 1) Check for cycle
      if (detectCycle(task.id)) {
        // Instead of skipping, remove the problematic node from the tasks list
        console.warn(`Removing problematic node (cycle) => Task ${task.id}`);
        tasks = removeProblematicNode(tasks, task.id);
        taskStatus.set(task.id, { executed: true, success: false });

        // We made progress by removing a cycle
        madeProgress = true;

        // Also reset cycle detection sets so next pass can re-check fresh
        visited.clear();
        visiting.clear();

        continue; // Move on to next task
      }

      // 2) Check dependencies
      if (!canExecute(task)) {
        // Not ready this pass => do not finalize, do not skip
        // We'll try again in the next pass
        continue;
      }

      // 3) All dependencies are good => executing
      try {
        console.log(`[DEBUG] Executing Task ${task.id}...`);
        await task.execute();
        logExecution(task.id, 'Executed successfully.');
        taskStatus.set(task.id, { executed: true, success: true });
      } catch (error: any) {
        console.log(`[DEBUG] Task ${task.id} failed with error:`, error);
        logExecution(task.id, `Failed with error: ${error.message || error}.`);
        taskStatus.set(task.id, { executed: true, success: false });
      }

      madeProgress = true; 
    }

    // Reset cycle detection for the *next* pass
    visited.clear();
    visiting.clear();
  }

  // 4) Final summary: which tasks ended up success, fail/skipped, or pending
  console.log('\nTask Execution Summary:');
  taskStatus.forEach((status, taskId) => {
    let state;
    if (status.success) {
      state = 'Success';
    } else if (status.executed) {
      state = 'Failed/Skipped';
    } else {
      state = 'Pending';
    }
    console.log(`Task ${taskId}: ${state}`);
  });

  console.log('[DEBUG] runAllTasks complete.');
};
