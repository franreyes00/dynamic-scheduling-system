import type { Task } from './tasks/taskManager';
import { addTask, getTasks } from './tasks/taskManager'; // or wherever your task manager is located
import { runAllTasks } from './tasks/runAllTasks';

// Define example tasks
const exampleTasks: Task[] = [
  {
    id: 1,
    execute: async () => {
      console.log('Task 1 executed');
    },
    dependencies: [2], // Depends on Task 2
  },
  {
    id: 2,
    execute: async () => {
      console.log('Task 2 executed');
    },
    dependencies: [3], // Depends on Task 3
  },
  {
    id: 3,
    execute: async () => {
      console.log('Task 3 executed');
    },
    dependencies: [], // No dependencies
  },
  {
    id: 4,
    execute: async () => {
      throw new Error('Task 4 failed');
    },
    dependencies: [3], // Depends on Task 3
  },
  {
    id: 5,
    execute: async () => {
      console.log('Task 5 executed');
    },
    dependencies: [4], // Depends on Task 4
  },
];

function bootstrapTasks(): void {
  for (const task of exampleTasks) {
    addTask(task);
  }
}

(async () => {
  console.log('Adding tasks...\n');
  bootstrapTasks();

  console.log('Current tasks:', getTasks());

  console.log('\nStarting task execution...\n');
  await runAllTasks();

  console.log('\nAll tasks processed!');
})();
