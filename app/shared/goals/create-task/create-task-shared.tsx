import classNames from 'classnames';
import React from 'react';
import { Priority } from '../../../graphql/types';
import TaskAssignee from '../../task/task-assignee';
import { ChangeEvent, ITaskFields } from './create-task';
import styles from './css/create-task-shared.css';
import labelStyles from './css/shared.css';
import CreateTaskDescription from './description';
import CreateTaskDueDate from './due-date';
import CreateTaskPriority from './priority';

interface IProps {
  taskFields: ITaskFields;
  patientId: string;
  onChange: (field: string) => (e: ChangeEvent) => void;
  onAssigneeClick: (assignedToId: string) => void;
  onPriorityClick: (priority: Priority) => void;
  onDueAtChange: (dueAt: string | null) => void;
}

const CreateTaskShared: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patientId, onChange, onAssigneeClick, onPriorityClick, onDueAtChange } = props;
  const { taskType, description, assignedToId, dueAt, priority } = props.taskFields;

  const assigneeLabelStyles = classNames(labelStyles.label, {
    [labelStyles.black]: !assignedToId,
  });

  return (
    <div>
      <CreateTaskDescription
        value={description}
        onChange={onChange('description')}
        taskType={taskType}
      />
      <TaskAssignee
        patientId={patientId}
        onAssigneeClick={onAssigneeClick}
        selectedAssigneeId={assignedToId}
        messageId="taskCreate.assignee"
        messageStyles={assigneeLabelStyles}
        dropdownStyles={styles.dropdown}
        menuStyles={styles.menu}
        largeFont={true}
      />
      <div className={styles.flex}>
        <CreateTaskDueDate value={dueAt} onChange={onDueAtChange} taskType={taskType} />
        <CreateTaskPriority value={priority} onChange={onPriorityClick} />
      </div>
    </div>
  );
};

export default CreateTaskShared;
