import React from 'react';
import { ShortUrgentTaskForPatientFragment } from '../../graphql/types';
import styles from './css/patient-tasks.css';
import PatientTaskList from './patient-task-list';

interface IProps {
  tasksDueSoon: ShortUrgentTaskForPatientFragment[];
  tasksWithNotifications: ShortUrgentTaskForPatientFragment[];
}

const PatientTasks: React.StatelessComponent<IProps> = (props: IProps) => {
  const { tasksDueSoon, tasksWithNotifications } = props;

  return (
    <div className={styles.container}>
      {!!tasksDueSoon.length && (
        <PatientTaskList
          messageId="dashboard.tasksDue"
          tasks={tasksDueSoon}
          withNotifications={false}
        />
      )}
      {!!tasksWithNotifications.length && (
        <PatientTaskList
          messageId="dashboard.notifications"
          tasks={tasksWithNotifications}
          withNotifications={true}
        />
      )}
    </div>
  );
};

export default PatientTasks;
