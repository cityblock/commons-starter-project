import React from 'react';
import { compose, graphql } from 'react-apollo';
import tasksDueSoonForPatient from '../../graphql/queries/get-tasks-due-soon-for-patient.graphql';
import tasksWithNotificationsForPatient from '../../graphql/queries/get-tasks-with-notifications-for-patient.graphql';
import { ShortUrgentTaskForPatient } from '../../graphql/types';
import { FullPatientForDashboard } from '../../graphql/types';
import PatientTasks from '../tasks/patient-tasks';
import styles from './css/patient-with-tasks-list-item.css';
import PatientListItem from './patient-list-item';

export interface IProps {
  patient: FullPatientForDashboard;
  selectedPatientId: string | null;
  toggleSelectedPatient: (patientId: string) => void;
}

interface IGraphqlProps {
  tasksDueSoonLoading?: boolean;
  tasksDueSoonError?: string | null;
  tasksDueSoon: ShortUrgentTaskForPatient[];
  tasksWithNotificationsLoading?: boolean;
  tasksWithNotificationsError?: string | null;
  tasksWithNotifications: ShortUrgentTaskForPatient[];
}

type allProps = IGraphqlProps & IProps;

export class PatientWithTasksListItem extends React.Component<allProps> {
  onPatientClick = (): void => {
    const {
      patient,
      toggleSelectedPatient,
      tasksDueSoonLoading,
      tasksDueSoonError,
      tasksWithNotificationsLoading,
      tasksWithNotificationsError,
    } = this.props;
    // do not open the task list if still loading or error
    if (
      tasksDueSoonLoading ||
      tasksDueSoonError ||
      tasksWithNotificationsLoading ||
      tasksWithNotificationsError
    ) {
      return;
    }

    toggleSelectedPatient(patient.id);
  };

  render(): JSX.Element {
    const {
      patient,
      selectedPatientId,
      tasksDueSoonLoading,
      tasksDueSoonError,
      tasksDueSoon,
      tasksWithNotificationsLoading,
      tasksWithNotificationsError,
      tasksWithNotifications,
    } = this.props;
    const tasksDueLoaded = !tasksDueSoonLoading && !tasksDueSoonError;
    const tasksWithNotificationsLoaded =
      !tasksWithNotificationsLoading && !tasksWithNotificationsError;
    const currentPatientSelected = patient.id === selectedPatientId;
    const otherPatientSelected = !currentPatientSelected && selectedPatientId !== null;
    const tasksDueCount = tasksDueLoaded ? tasksDueSoon.length : null;
    const notificationsCount = tasksWithNotificationsLoaded ? tasksWithNotifications.length : null;
    const tasksVisible = tasksDueLoaded && tasksWithNotificationsLoaded && currentPatientSelected;

    return (
      <div onClick={this.onPatientClick} className={otherPatientSelected ? styles.opaque : ''}>
        <PatientListItem
          patient={patient}
          displayType="task"
          tasksDueCount={tasksDueCount}
          notificationsCount={notificationsCount}
          selected={tasksVisible}
        />
        {tasksVisible && (
          <PatientTasks
            tasksDueSoon={tasksDueSoon}
            tasksWithNotifications={tasksWithNotifications}
          />
        )}
      </div>
    );
  }
}

export default compose(
  graphql(tasksDueSoonForPatient, {
    options: ({ patient }: IProps) => ({
      variables: { patientId: patient.id },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      tasksDueSoonLoading: data ? data.loading : false,
      tasksDueSoonError: data ? data.error : null,
      tasksDueSoon: data ? (data as any).tasksDueSoonForPatient : null,
    }),
  }),
  graphql(tasksWithNotificationsForPatient, {
    options: ({ patient }: IProps) => ({
      variables: { patientId: patient.id },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      tasksWithNotificationsLoading: data ? data.loading : false,
      tasksWithNotificationsError: data ? data.error : null,
      tasksWithNotifications: data ? (data as any).tasksWithNotificationsForPatient : null,
    }),
  }),
)(PatientWithTasksListItem) as React.ComponentClass<IProps>;
