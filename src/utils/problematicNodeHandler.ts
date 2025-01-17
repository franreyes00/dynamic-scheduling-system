import type { Task } from '../tasks/taskManager';

// Remove a problematic node and adjust dependencies
export const removeProblematicNode = (tasks: Task[], problematicNodeId: number): Task[] => {
  console.warn(`Removing problematic node: ${problematicNodeId}`);
  return tasks
    .filter(task => task.id !== problematicNodeId)
    .map(task => ({
      ...task,
      dependencies: task.dependencies.filter(dep => dep !== problematicNodeId),
    }));
};