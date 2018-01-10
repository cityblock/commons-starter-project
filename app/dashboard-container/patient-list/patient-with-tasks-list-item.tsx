import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as tasksDueSoonForPatientQuery from '../../graphql/queries/get-tasks-due-soon-for-patient.graphql';
import * as tasksWithNotificationsForPatientQuery from '../../graphql/queries/get-tasks-with-notifications-for-patient.graphql';
import {
  getTasksDueSoonForPatientQuery,
  getTasksWithNotificationsForPatientQuery,
} from '../../graphql/types';
import { FullPatientForDashboardFragment } from '../../graphql/types';
import PatientListItem from './patient-list-item';

export interface IProps {
  patient: FullPatientForDashboardFragment;
}

interface IGraphqlProps {
  tasksDueSoonLoading?: boolean;
  tasksDueSoonError?: string | null;
  tasksDueSoon: getTasksDueSoonForPatientQuery['tasksDueSoonForPatient'];
  tasksWithNotificationsLoading?: boolean;
  tasksWithNotificationsError?: string | null;
  tasksWithNotifications: getTasksWithNotificationsForPatientQuery['tasksWithNotificationsForPatient'];
}

type allProps = IGraphqlProps & IProps;

export class PatientWithTasksListItem extends React.Component<allProps> {
  render(): JSX.Element {
    const { patient } = this.props;

    return <PatientListItem patient={patient} taskView={true} />;
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(tasksDueSoonForPatientQuery as any, {
    options: ({ patient }) => ({
      variables: { patientId: patient.id },
    }),
    props: ({ data }) => ({
      tasksDueSoonLoading: data ? data.loading : false,
      tasksDueSoonError: data ? data.error : null,
      tasksDueSoon: data ? (data as any).tasksDueSoonForPatient : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(tasksWithNotificationsForPatientQuery as any, {
    options: ({ patient }) => ({
      variables: { patientId: patient.id },
    }),
    props: ({ data }) => ({
      tasksWithNotificationsLoading: data ? data.loading : false,
      tasksWithNotificationsError: data ? data.error : null,
      tasksWithNotifications: data ? (data as any).tasksWithNotificationsForPatient : null,
    }),
  }),
)(PatientWithTasksListItem);
