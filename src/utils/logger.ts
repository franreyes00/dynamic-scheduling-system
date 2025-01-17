
export const logExecutionOrder = (executionOrder: string[]): void => {
  console.log('Execution Order:');
  executionOrder.forEach((entry) => console.log(entry));
};
