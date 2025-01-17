# Dynamic Scheduling System
#### This project provides a flexible and dynamic scheduling solution. The goal is to define, manage, and execute tasks in a controlled order, respecting dependencies between tasks and handling scenarios like cycles or failures.

### Features
#### Task Management:
Add, update, replace, and delete tasks.

#### Dependency Resolution:
Ensures tasks only run when their dependencies are complete and successful.

#### Cycle Detection and Handling:
Identifies cyclic dependencies and removes problematic nodes to maintain a valid execution order.

#### Task Execution Flow:
Executes tasks in the proper sequence, skipping tasks that cannot be completed due to unresolved dependencies.

#### Clear Logging:
Provides detailed logs of execution order, successes, failures, and skipped tasks.

### Setup:

#### Install Dependencies:
``` npm install ```

#### Build the Project:
``` npm run build ```

#### Run the Project:
``` node ./dist/index.js ```

#### Running Tests
This project uses Jest for testing. To run the test suite, use:
``` npm test ```

### Folder Structure
#### src/:
Main source code files.

#### src/tasks/:
Task-related logic, including adding, updating, and executing tasks.

#### src/utils/:
Utility functions for dependency handling, logging, and node removal.

#### src/test/:
Test files for various modules.