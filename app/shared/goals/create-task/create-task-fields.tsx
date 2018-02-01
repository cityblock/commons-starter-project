import * as React from 'react';
import { Priority } from '../../../graphql/types';
import CreateTaskCBO from './cbo';
import CreateTaskCBOCategory from './cbo-category';
import { ChangeEvent, ITaskFields } from './create-task';
import CreateTaskShared from './create-task-shared';
import * as styles from './css/shared.css';
import CreateTaskType from './task-type';
import CreateTaskTitle from './title';

interface IProps {
  taskFields: ITaskFields;
  patientId: string;
  onChange: (field: string) => (e: ChangeEvent) => void;
  onAssigneeClick: (assignedToId: string) => void;
  onPriorityClick: (priority: Priority) => void;
}

const CreateTaskFields: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patientId, onChange, onAssigneeClick, onPriorityClick, taskFields } = props;
  const { taskType, categoryId, title, CBOId, CBOName, CBOUrl } = taskFields;

  let body = <div className={styles.placeholder} />;
  const sharedFields = (
    <CreateTaskShared
      taskFields={taskFields}
      patientId={patientId}
      onChange={onChange}
      onAssigneeClick={onAssigneeClick}
      onPriorityClick={onPriorityClick}
    />
  );

  if (taskType === 'general') {
    body = (
      <div>
        <CreateTaskTitle value={title} onChange={onChange('title')} />
        {sharedFields}
      </div>
    );
  } else if (taskType === 'CBOReferral') {
    body = (
      <div className={styles.placeholder}>
        <CreateTaskCBOCategory categoryId={categoryId} onChange={onChange('categoryId')} />
        {!!categoryId && (
          <div>
            <CreateTaskCBO
              categoryId={categoryId}
              CBOId={CBOId}
              CBOName={CBOName}
              CBOUrl={CBOUrl}
              onChange={onChange}
            />
            {sharedFields}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <CreateTaskType value={taskType} onChange={onChange('taskType')} />
      {body}
    </div>
  );
};

export default CreateTaskFields;
