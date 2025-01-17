import type { Task } from '../tasks/taskManager';

export const sanitizeTasks = (tasks: Task[]): Task[] => {
  return tasks.map(task => {
    if (task.dependencies.includes(task.id)) {
      console.warn(`Task ${task.id} has itself as a dependency. Self-dependency removed.`);
      return {
        ...task,
        dependencies: task.dependencies.filter(dep => dep !== task.id),
      };
    }
    return task;
  });
};