// tests/problematicNodeHandler.test.ts
import { removeProblematicNode } from '../../utils/problematicNodeHandler';
import type { Task } from '../../tasks/taskManager';

describe('removeProblematicNode', () => {
  test('removes the problematic node from the tasks list', () => {
    const tasks: Task[] = [
      { id: 1, execute: jest.fn(), dependencies: [2, 3] },
      { id: 2, execute: jest.fn(), dependencies: [3] },
      { id: 3, execute: jest.fn(), dependencies: [] }
    ];

    const result = removeProblematicNode(tasks, 2);

    expect(result).toEqual([
      { id: 1, execute: expect.any(Function), dependencies: [3] },
      { id: 3, execute: expect.any(Function), dependencies: [] }
    ]);
  });

  test('removes the problematic node from other task dependencies', () => {
    const tasks: Task[] = [
      { id: 1, execute: jest.fn(), dependencies: [2, 3] },
      { id: 2, execute: jest.fn(), dependencies: [3, 4] },
      { id: 3, execute: jest.fn(), dependencies: [] },
      { id: 4, execute: jest.fn(), dependencies: [] }
    ];

    const result = removeProblematicNode(tasks, 4);

    expect(result).toEqual([
      { id: 1, execute: expect.any(Function), dependencies: [2, 3] },
      { id: 2, execute: expect.any(Function), dependencies: [3] },
      { id: 3, execute: expect.any(Function), dependencies: [] }
    ]);
  });

  test('returns the same tasks list if the problematic node is not present', () => {
    const tasks: Task[] = [
      { id: 1, execute: jest.fn(), dependencies: [2, 3] },
      { id: 2, execute: jest.fn(), dependencies: [3] },
      { id: 3, execute: jest.fn(), dependencies: [] }
    ];

    const result = removeProblematicNode(tasks, 99);

    expect(result).toEqual(tasks);
  });

  test('handles empty tasks list gracefully', () => {
    const tasks: Task[] = [];

    const result = removeProblematicNode(tasks, 2);

    expect(result).toEqual([]);
  });
});
