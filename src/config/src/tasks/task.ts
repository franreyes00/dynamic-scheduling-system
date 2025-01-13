/**
 * Task type definition
 * @type Task - Represents a task with unique ID, execution logic, dependencies, and execution state
 * @param id - Unique identifier for the task, of type number
 * @param execute - Function that returns a Promise, used to execute the task
 * @param dependencies - Array of task IDs that this task depends on
 * @param executed - Flag indicating whether the task has been executed or not
 * @author FranReyes00
 */
export type Task = {
    id: number;
    execute: () => Promise<void>;
    dependencies: number[];
    executed: boolean;
  };
  
  /**
   * Array to store the registered tasks
   * @type Task[] - An array of Task objects where each task has a unique ID and execution details
   * @author FranReyes00
   */
  let tasks: Task[] = [];
  
  /**
   * Variable to generate unique task IDs
   * @type number - A pointer that increments to ensure each task gets a unique ID
   * @author FranReyes00
   */
  let nextId: number = 1; 
  
  /**
   * Adds a new task to the tasks list
   * @param task - The task to be added, excluding the id and executed fields
   * @returns The newly created task with an assigned unique id
   * @author FranReyes00
   */
  export const addTask = (task: Omit<Task, "id" | "executed">): Task => {
    const newTask: Task = {
      id: nextId++,  
      execute: task.execute,
      dependencies: task.dependencies,
      executed: false,  
    };
  
    tasks.push(newTask); 
    console.log(`Task ${newTask.id} added with dependencies: ${newTask.dependencies.join(", ")}`);
    
    return newTask; 
  }
  
  /**
   * Retrieves all tasks stored in the task list
   * @returns The array of all tasks
   * @author FranReyes00
   */
  export const getTasks = (): Task[] => {
    return tasks;  
  };
  