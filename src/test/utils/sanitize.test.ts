// tests/sanitizeTasks.test.ts
import { sanitizeTasks } from '../../utils/sanitizeTasks';
import type { Task } from '../../tasks/taskManager';

describe('sanitizeTasks', () => {
  test('removes self-dependencies from a task', () => {
    const tasks: Task[] = [
      { id: 1, execute: jest.fn(), dependencies: [1, 2, 3] }
    ];

    const sanitizedTasks = sanitizeTasks(tasks);

    expect(sanitizedTasks).toEqual([
      { id: 1, execute: expect.any(Function), dependencies: [2, 3] }
    ]);
  });

  test('does not modify tasks without self-dependencies', () => {
    const tasks: Task[] = [
      { id: 1, execute: jest.fn(), dependencies: [2, 3] }
    ];

    const sanitizedTasks = sanitizeTasks(tasks);

    expect(sanitizedTasks).toEqual(tasks);
  });

  test('handles multiple tasks with mixed dependencies', () => {
    const tasks: Task[] = [
      { id: 1, execute: jest.fn(), dependencies: [1, 2] },
      { id: 2, execute: jest.fn(), dependencies: [3] },
      { id: 3, execute: jest.fn(), dependencies: [3, 1] }
    ];

    const sanitizedTasks = sanitizeTasks(tasks);

    expect(sanitizedTasks).toEqual([
      { id: 1, execute: expect.any(Function), dependencies: [2] },
      { id: 2, execute: expect.any(Function), dependencies: [3] },
      { id: 3, execute: expect.any(Function), dependencies: [1] }
    ]);
  });
});
