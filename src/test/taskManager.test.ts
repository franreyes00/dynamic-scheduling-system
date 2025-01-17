// tests/taskManager.test.ts
import {
    addTask,
    getTasks,
    deleteTask,
    updateTask,
    replaceTask,
    Task,
  } from '../tasks/taskManager';
  
  describe('taskManager', () => {
    beforeEach(() => {
      // Reset tasks array before each test
      (getTasks() as any).length = 0;
    });
  
    describe('addTask', () => {
      test('adds a task with valid ID', () => {
        const task: Task = { id: 1, execute: jest.fn(), dependencies: [] };
        const result = addTask(task);
        expect(result).toEqual(task);
        expect(getTasks()).toContainEqual(task);
      });
  
      test('does not add a task with invalid ID', () => {
        const invalidTask = { id: NaN, execute: jest.fn(), dependencies: [] };
        const result = addTask(invalidTask as unknown as Task);
        expect(result).toBeNull();
        expect(getTasks()).toHaveLength(0);
      });
  
      test('does not add a task with duplicate ID', () => {
        const task: Task = { id: 1, execute: jest.fn(), dependencies: [] };
        addTask(task);
        const result = addTask(task);
        expect(result).toBeNull();
        expect(getTasks()).toHaveLength(1);
      });
    });
  
    describe('getTasks', () => {
      test('retrieves all tasks', () => {
        const task1: Task = { id: 1, execute: jest.fn(), dependencies: [] };
        const task2: Task = { id: 2, execute: jest.fn(), dependencies: [] };
        addTask(task1);
        addTask(task2);
        const tasks = getTasks();
        expect(tasks).toHaveLength(2);
        expect(tasks).toContainEqual(task1);
        expect(tasks).toContainEqual(task2);
      });
    });
  
    describe('deleteTask', () => {
      test('deletes an existing task by ID', () => {
        const task: Task = { id: 1, execute: jest.fn(), dependencies: [] };
        addTask(task);
        const result = deleteTask(1);
        expect(result).toBe(true);
        expect(getTasks()).toHaveLength(0);
      });
  
      test('does not delete a non-existent task', () => {
        const result = deleteTask(1);
        expect(result).toBe(false);
      });
    });
  
    describe('updateTask', () => {
      test('updates an existing task', () => {
        const task: Task = { id: 1, execute: jest.fn(), dependencies: [] };
        addTask(task);
        const newDependencies = [2, 3];
        const result = updateTask(1, { dependencies: newDependencies });
        expect(result).toEqual({ ...task, dependencies: newDependencies });
        expect(getTasks()[0]).toEqual({ ...task, dependencies: newDependencies });
      });
  
      test('does not update a non-existent task', () => {
        const result = updateTask(1, { dependencies: [2] });
        expect(result).toBeNull();
      });
    });
  
    describe('replaceTask', () => {
      test('replaces an existing task', () => {
        const task: Task = { id: 1, execute: jest.fn(), dependencies: [] };
        addTask(task);
        const newTask = { execute: jest.fn(), dependencies: [2, 3] };
        const result = replaceTask(1, newTask);
        expect(result).toEqual({ id: 1, ...newTask });
        expect(getTasks()[0]).toEqual({ id: 1, ...newTask });
      });
  
      test('does not replace a non-existent task', () => {
        const newTask = { execute: jest.fn(), dependencies: [2, 3] };
        const result = replaceTask(1, newTask);
        expect(result).toBeNull();
      });
    });
  });
  