import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import * as patientCarePlanQuery from '../graphql/queries/get-patient-care-plan.graphql';
import * as taskIdsWithNotificationsForPatientQuery from '../graphql/queries/get-task-ids-with-notifications-for-patient.graphql';
import { getPatientCarePlanQuery, getTaskIdsWithNotificationsForPatientQuery } from '../graphql/types';
import Task from '../shared/task/task';
import * as styles from './css/patient-map.css';
import DnDPatientCarePlan from './drag-and-drop/drag-and-drop-patient-care-plan';
import MapModals from './modals/modals';

export interface IProps {
  patientId: string;
  loading?: boolean;
  routeBase: string;
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  taskIdsWithNotifications?: string[];
  taskId: string | null;
  history: History;
}

interface IGraphqlProps {
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  taskIdsWithNotifications?: getTaskIdsWithNotificationsForPatientQuery['taskIdsWithNotificationsForPatient'];
  loading?: boolean;
  error?: string | null;
}

export type allProps = IGraphqlProps & IProps;

export class PatientMap extends React.Component<allProps, {}> {
  closeTask = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (this.props.taskId) {
      this.props.history.push(this.props.routeBase);
      this.forceUpdate();
    }
  };

  // prevent task from closing when task clicked on
  stopPropagation = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (this.props.taskId) {
      e.stopPropagation();
    }
  };

  render(): JSX.Element {
    const { patientId, loading, routeBase, carePlan, taskIdsWithNotifications, taskId } = this.props;

    const mainStyles = classNames({
      [styles.full]: !taskId,
      [styles.split]: !!taskId,
    });
    const sideBarStyles = classNames({
      [styles.collapsed]: !taskId,
      [styles.split]: !!taskId,
      [styles.leftMargin]: !!taskId,
    });

    return (
      <div className={styles.container} onClick={this.closeTask}>
        <MapModals />
        <div className={mainStyles}>
          <DnDPatientCarePlan
            loading={loading}
            carePlan={carePlan}
            taskIdsWithNotifications={taskIdsWithNotifications}
            routeBase={routeBase}
            patientId={patientId}
            selectedTaskId={taskId || ''}
          />
        </div>
        <div className={sideBarStyles} onClick={this.stopPropagation}>
          {taskId && <Task routeBase={routeBase} taskId={taskId} />}
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql<IGraphqlProps, IProps, allProps>(patientCarePlanQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
      fetchPolicy: 'cache-and-network', // Always get the latest care plan
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      carePlan: data ? (data as any).carePlanForPatient : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(taskIdsWithNotificationsForPatientQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
      fetchPolicy: 'cache-and-network', // Always get the latest care plan
    }),
    props: ({ data }) => {
      let taskIdsWithNotifications: string[] | null = null;
      if (data) {
        const response = (data as any).taskIdsWithNotificationsForPatient;

        if (response) {
          taskIdsWithNotifications = Object.keys(response).map(key => response[key].id);
        }
      }

      return {
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        taskIdsWithNotifications,
      };
    },
  }),
)(PatientMap);
