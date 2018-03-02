import * as React from 'react';
import {
  taskEditMutation,
  taskEditMutationVariables,
  FullCBOReferralFragment,
} from '../../graphql/types';
import FormLabel from '../../shared/library/form-label/form-label';
import * as styles from './css/task-body.css';
import { isCBOReferralRequiringAction } from './helpers/helpers';
import { Divider } from './task';
import TaskCBOReferral from './task-cbo-referral';
import TaskInfo from './task-info';
import { CBOReferralStatusType } from './task-info';

interface IProps {
  taskId: string;
  title: string;
  description: string;
  concern: string;
  goal: string;
  patientId: string;
  CBOReferral: FullCBOReferralFragment | null;
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
}

const TaskBody: React.StatelessComponent<IProps> = (props: IProps) => {
  const { title, description, taskId, concern, goal, editTask, CBOReferral, patientId } = props;
  let CBOReferralStatus = 'notCBOReferral';
  if (!!CBOReferral) {
    CBOReferralStatus = isCBOReferralRequiringAction(CBOReferral)
      ? 'CBOReferralRequiringAction'
      : 'CBOReferral';
  }

  return (
    <div>
      <TaskInfo
        taskId={taskId}
        title={title}
        description={description}
        editTask={editTask}
        CBOReferralStatus={CBOReferralStatus as CBOReferralStatusType}
      />
      {!!CBOReferral && (
        <TaskCBOReferral CBOReferral={CBOReferral} taskId={taskId} patientId={patientId} />
      )}
      <Divider />
      <div className={styles.associations}>
        <div className={styles.detail}>
          <FormLabel messageId="task.concern" gray={true} small={true} />
          <h3 className={styles.black}>{concern}</h3>
        </div>
        <div className={styles.detail}>
          <FormLabel messageId="task.goal" gray={true} small={true} />
          <h3 className={styles.black}>{goal}</h3>
        </div>
      </div>
    </div>
  );
};

export default TaskBody;
