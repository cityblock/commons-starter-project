import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ShortUrgentTaskForPatientFragment } from '../../graphql/types';
import * as styles from './css/patient-task-list.css';
import PatientTask from './patient-task';

interface IProps {
  messageId: string; // for header of list
  tasks: ShortUrgentTaskForPatientFragment[];
  withNotifications: boolean;
}

const PatientTaskList: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, tasks, withNotifications } = props;

  const renderedTasks = tasks.map(task => (
    <PatientTask key={task.id} task={task} withNotifications={withNotifications} />
  ));

  return (
    <div className={styles.container}>
      <FormattedMessage id={messageId}>{(message: string) => <h5>{message}</h5>}</FormattedMessage>
      {renderedTasks}
    </div>
  );
};

export default PatientTaskList;
