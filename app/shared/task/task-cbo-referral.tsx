import * as React from 'react';
import { FullCBOReferralFragment } from '../../graphql/types';
import { Divider } from './task';
import TaskCBODetail from './task-cbo-detail';
import TaskCBOReferralView from './task-cbo-referral-view';

interface IProps {
  CBOReferral: FullCBOReferralFragment;
  taskId: string;
}

const TaskCBOReferral: React.StatelessComponent<IProps> = (props: IProps) => {
  const { CBOReferral, taskId } = props;

  return (
    <div>
      <TaskCBODetail CBOReferral={CBOReferral} />
      <TaskCBOReferralView taskId={taskId} />
      <Divider />
    </div>
  );
};

export default TaskCBOReferral;
