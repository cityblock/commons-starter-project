import React from 'react';
import { FullCBOReferral } from '../../graphql/types';
import TaskCBOReferralDate from './task-cbo-referral-date';

interface IProps {
  CBOReferral: FullCBOReferral;
  taskId: string;
}

export const TaskCBOReferralDates: React.StatelessComponent<IProps> = (props: IProps) => {
  const { CBOReferral, taskId } = props;

  return (
    <div>
      <TaskCBOReferralDate
        field="sentAt"
        value={CBOReferral.sentAt}
        taskId={taskId}
        CBOReferralId={CBOReferral.id}
      />
      <TaskCBOReferralDate
        field="acknowledgedAt"
        value={CBOReferral.acknowledgedAt}
        taskId={taskId}
        CBOReferralId={CBOReferral.id}
        topMargin={true}
      />
    </div>
  );
};

export default TaskCBOReferralDates;
