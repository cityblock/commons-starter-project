export interface ITaskSelected {
  type: 'TASK_SELECTED';
  taskId?: string;
}

// TODO: Remove this, can likely use router instead (see risk area implementation)
export function selectTask(taskId?: string): ITaskSelected {
  return {
    type: 'TASK_SELECTED',
    taskId,
  };
}
