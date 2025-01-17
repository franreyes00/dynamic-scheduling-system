import { runAllTasks } from '../tasks/runAllTasks';
import { getTasks, Task } from '../tasks/taskManager';
import { sanitizeTasks } from '../utils/sanitizeTasks';
import { removeProblematicNode } from '../utils/problematicNodeHandler';

jest.mock('./tasks/taskManager');
jest.mock('./utils/sanitizeTasks');
jest.mock('./utils/problematicNodeHandler');

describe('runAllTasks - Simple and Multiple Dependencies', () => {
  let tasks: Task[];

  beforeEach(() => {
    jest.clearAllMocks();
    tasks = [];
    (getTasks as jest.Mock).mockReturnValue(tasks);
    (sanitizeTasks as jest.Mock).mockImplementation(tasks => tasks);
    (removeProblematicNode as jest.Mock).mockImplementation((tasks, problematicNodeId) =>
      tasks.filter((task: Task) => task.id !== problematicNodeId)
    );
  });

  describe('Simple dependencies', () => {
    test('single dependency is executed before its dependent task', async () => {
      tasks.push(
        { id: 1, execute: jest.fn(), dependencies: [2] },
        { id: 2, execute: jest.fn(), dependencies: [] }
      );
      await runAllTasks();
      expect(tasks[1].execute).toHaveBeenCalled();
      expect(tasks[0].execute).toHaveBeenCalled();
    });

    test('task with no dependencies executes first', async () => {
      tasks.push(
        { id: 1, execute: jest.fn(), dependencies: [] },
        { id: 2, execute: jest.fn(), dependencies: [1] }
      );
      await runAllTasks();
      expect(tasks[0].execute).toHaveBeenCalled();
      expect(tasks[1].execute).toHaveBeenCalled();
    });

    test('task fails and prevents dependent tasks from running', async () => {
      tasks.push(
        { id: 1, execute: jest.fn(() => Promise.reject('Failed')), dependencies: [] },
        { id: 2, execute: jest.fn(), dependencies: [1] }
      );
      await runAllTasks();
      expect(tasks[0].execute).toHaveBeenCalled();
      expect(tasks[1].execute).not.toHaveBeenCalled();
    });

    test('removing cycles allows other tasks to run', async () => {
      tasks.push(
        { id: 1, execute: jest.fn(), dependencies: [2] },
        { id: 2, execute: jest.fn(), dependencies: [1] },
        { id: 3, execute: jest.fn(), dependencies: [] }
      );
      await runAllTasks();
      expect(removeProblematicNode).toHaveBeenCalledWith(expect.any(Array), 1);
      expect(tasks[2].execute).toHaveBeenCalled();
    });
  });

  describe('Multiple dependencies', () => {
    test('multiple dependencies must all succeed before dependent task runs', async () => {
      tasks.push(
        { id: 1, execute: jest.fn(), dependencies: [2, 3] },
        { id: 2, execute: jest.fn(), dependencies: [] },
        { id: 3, execute: jest.fn(), dependencies: [] }
      );
      await runAllTasks();
      expect(tasks[1].execute).toHaveBeenCalled();
      expect(tasks[2].execute).toHaveBeenCalled();
      expect(tasks[0].execute).toHaveBeenCalled();
    });

    test('one failing dependency prevents dependent task from running', async () => {
      tasks.push(
        { id: 1, execute: jest.fn(), dependencies: [2, 3] },
        { id: 2, execute: jest.fn(() => Promise.reject('Failed')), dependencies: [] },
        { id: 3, execute: jest.fn(), dependencies: [] }
      );
      await runAllTasks();
      expect(tasks[1].execute).toHaveBeenCalled();
      expect(tasks[2].execute).toHaveBeenCalled();
      expect(tasks[0].execute).not.toHaveBeenCalled();
    });

    test('complex chain with 4 dependencies executes in order', async () => {
      tasks.push(
        { id: 1, execute: jest.fn(), dependencies: [2] },
        { id: 2, execute: jest.fn(), dependencies: [3] },
        { id: 3, execute: jest.fn(), dependencies: [4] },
        { id: 4, execute: jest.fn(), dependencies: [] }
      );
      await runAllTasks();
      expect(tasks[3].execute).toHaveBeenCalled();
      expect(tasks[2].execute).toHaveBeenCalled();
      expect(tasks[1].execute).toHaveBeenCalled();
      expect(tasks[0].execute).toHaveBeenCalled();
    });

    test('cycle involving 5 dependencies is resolved', async () => {
      tasks.push(
        { id: 1, execute: jest.fn(), dependencies: [2] },
        { id: 2, execute: jest.fn(), dependencies: [3] },
        { id: 3, execute: jest.fn(), dependencies: [4] },
        { id: 4, execute: jest.fn(), dependencies: [5] },
        { id: 5, execute: jest.fn(), dependencies: [1] } // Creates a cycle
      );
      await runAllTasks();
      expect(removeProblematicNode).toHaveBeenCalledWith(expect.any(Array), 1);
    });
  });
});
