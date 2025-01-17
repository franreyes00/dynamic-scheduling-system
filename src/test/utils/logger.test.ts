// tests/logger.test.ts
import { logExecutionOrder } from '../../utils/logger';

describe('logExecutionOrder', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('logs each entry in the provided order', () => {
    const executionOrder = ['Task 1', 'Task 2', 'Task 3'];
    logExecutionOrder(executionOrder);

    expect(consoleSpy).toHaveBeenCalledWith('Execution Order:');
    executionOrder.forEach((entry) => {
      expect(consoleSpy).toHaveBeenCalledWith(entry);
    });
  });

  test('logs only the header if execution order is empty', () => {
    logExecutionOrder([]);

    expect(consoleSpy).toHaveBeenCalledWith('Execution Order:');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
