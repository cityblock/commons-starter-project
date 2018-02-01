import * as React from 'react';
import CreateTaskCBO from '../goals/create-task/cbo';
import CreateTaskCBOCategory from '../goals/create-task/cbo-category';
import CreateTaskDescription from '../goals/create-task/description';
import ModalButtons from '../library/modal-buttons/modal-buttons';
import * as styles from './css/task-cbo-add-information-fields.css';
import { ChangeEvent, ITaskCBOInformationFields } from './task-cbo-add-information-popup';

interface IProps {
  taskCBOInformation: ITaskCBOInformationFields;
  onChange: (field: string) => ((e: ChangeEvent) => void);
  onSubmit: () => void;
  onCancel: () => void;
}

const TaskCBOAddInformationFields: React.StatelessComponent<IProps> = (props: IProps) => {
  const { taskCBOInformation, onChange, onSubmit, onCancel } = props;
  const { categoryId, CBOId, CBOName, CBOUrl, description } = taskCBOInformation;

  return (
    <div className={styles.fields}>
      <CreateTaskCBOCategory categoryId={categoryId} onChange={onChange('categoryId')} />
      <CreateTaskCBO
        categoryId={categoryId}
        CBOId={CBOId}
        CBOName={CBOName}
        CBOUrl={CBOUrl}
        onChange={onChange}
      />
      <CreateTaskDescription
        onChange={onChange('description')}
        value={description}
        taskType="CBOReferral"
      />
      <ModalButtons cancel={onCancel} submit={onSubmit} />
    </div>
  );
};

export default TaskCBOAddInformationFields;
