import * as React from 'react';
import * as styles from './css/patient-task-count.css';
import TaskCountItem from './task-count-item';

interface IProps {
  tasksDueCount: number | null; // number of tasks due, only for task view
  notificationsCount: number | null; // number of tasks with notifications, only for task view
}

const PatientTaskCount: React.StatelessComponent<IProps> = (props: IProps) => {
  const { tasksDueCount, notificationsCount } = props;

  return (
    <div className={styles.container}>
      <TaskCountItem messageId="dashboard.tasksDue" count={tasksDueCount} />
      <TaskCountItem messageId="dashboard.notifications" count={notificationsCount} />
    </div>
  );
};

export default PatientTaskCount;
