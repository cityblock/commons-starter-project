export interface ITaskSelected {
  type: 'TASK_SELECTED';
  taskId?: string;
}

export function selectTask(taskId?: string): ITaskSelected {
  return {
    type: 'TASK_SELECTED',
    taskId,
  };
}
