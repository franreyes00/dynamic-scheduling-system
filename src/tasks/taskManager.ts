// taskManager.ts
export type Task = {
  id: number;
  execute: () => Promise<void>;
  dependencies: number[];
};

let tasks: Task[] = [];

// Add a new task
export const addTask = (task: Task): Task | null => {
  if (typeof task.id !== 'number' || isNaN(task.id)) {
    console.log('Invalid ID: ID must be a valid number.');
    return null;
  }

  const existingTask = tasks.find(t => t.id === task.id);
  if (existingTask) {
    console.log(`Task with ID ${task.id} already exists.`);
    return null;
  }

  tasks.push(task);
  console.log(`Task ${task.id} added with dependencies: ${task.dependencies.join(', ')}`);
  return task;
};

// Retrieve all tasks
export const getTasks = (): Task[] => {
  return tasks;
};

// Delete a task by ID
export const deleteTask = (id: number): boolean => {
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    console.log(`Task ${id} deleted.`);
    return true;
  } else {
    console.log(`Task ${id} not found.`);
    return false;
  }
};

// Update a task by ID
export const updateTask = (
  id: number,
  updates: Partial<Omit<Task, 'id'>>
): Task | null => {
  const task = tasks.find(task => task.id === id);
  if (task) {
    if (updates.execute) task.execute = updates.execute;
    if (updates.dependencies) task.dependencies = updates.dependencies;
    console.log(`Task ${id} updated.`);
    return task;
  } else {
    console.log(`Task ${id} not found.`);
    return null;
  }
};

// Replace a task by ID
export const replaceTask = (
  id: number,
  newTask: Omit<Task, 'id'>
): Task | null => {
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    const replacedTask: Task = {
      id: id,
      execute: newTask.execute,
      dependencies: newTask.dependencies,
    };
    tasks[index] = replacedTask;
    console.log(`Task ${id} replaced.`);
    return replacedTask;
  } else {
    console.log(`Task ${id} not found.`);
    return null;
  }
};
