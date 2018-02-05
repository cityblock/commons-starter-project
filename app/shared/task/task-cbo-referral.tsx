import * as React from 'react';
import { FullCBOReferralFragment } from '../../graphql/types';
import { isCBOReferralRequiringAction } from './helpers/helpers';
import { Divider } from './task';
import TaskCBOAddInformation from './task-cbo-add-information';
import TaskCBODetail from './task-cbo-detail';
import TaskCBOReferralDates from './task-cbo-referral-dates';
import TaskCBOReferralView from './task-cbo-referral-view';

interface IProps {
  CBOReferral: FullCBOReferralFragment;
  taskId: string;
}

const TaskCBOReferral: React.StatelessComponent<IProps> = (props: IProps) => {
  const { CBOReferral, taskId } = props;
  const isActionRequired = isCBOReferralRequiringAction(CBOReferral);

  if (isActionRequired) {
    return <TaskCBOAddInformation taskId={taskId} />;
  }

  return (
    <div>
      <TaskCBODetail CBOReferral={CBOReferral} />
      <TaskCBOReferralView taskId={taskId} />
      <Divider />
      <TaskCBOReferralDates CBOReferral={CBOReferral} taskId={taskId} />
    </div>
  );
};

export default TaskCBOReferral;
