import classNames from 'classnames';
import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import patientCarePlanGraphql from '../graphql/queries/get-patient-care-plan.graphql';
import taskIdsWithNotificationsGraphql from '../graphql/queries/get-task-ids-with-notifications.graphql';
import { getPatientCarePlan } from '../graphql/types';
import Task from '../shared/task/task';
import styles from './css/patient-map.css';
import DnDPatientCarePlan from './drag-and-drop/drag-and-drop-patient-care-plan';
import MapModals from './modals/modals';
import sharedStyles from './patient-three-sixty/css/shared.css';

export interface IProps {
  patientId: string;
  routeBase: string;
  taskId: string | null;
  goalId: string | null;
  glassBreakId: string | null;
}

interface IRouterProps {
  history: History;
}

interface IGraphqlProps {
  carePlan?: getPatientCarePlan['carePlanForPatient'];
  taskIdsWithNotifications?: string[];
  refetch: () => Promise<any>;
  loading?: boolean;
  error?: string | null;
}

export type allProps = IGraphqlProps & IProps & IRouterProps;

export class PatientMap extends React.Component<allProps, {}> {
  closeTask = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (this.props.taskId) {
      this.props.history.push(this.props.routeBase);
      this.forceUpdate();
    }
  };

  render(): JSX.Element {
    const {
      patientId,
      loading,
      routeBase,
      carePlan,
      taskIdsWithNotifications,
      taskId,
      goalId,
      refetch,
    } = this.props;
    const mainStyles = classNames(sharedStyles.scroll, {
      [styles.full]: !taskId,
      [sharedStyles.domains]: !!taskId,
      [styles.split]: !!taskId,
    });
    const sideBarHtml = taskId ? (
      <Task routeBase={routeBase} taskId={taskId} />
    ) : (
      <div className={styles.collapsed} />
    );

    return (
      <React.Fragment>
        <MapModals refetchCarePlan={refetch} patientId={patientId} />
        <div className={sharedStyles.bodyFlex} onClick={this.closeTask}>
          <div className={mainStyles}>
            <DnDPatientCarePlan
              loading={loading}
              carePlan={carePlan}
              taskIdsWithNotifications={taskIdsWithNotifications}
              routeBase={routeBase}
              patientId={patientId}
              selectedTaskId={taskId || ''}
              selectedGoalId={goalId || ''}
            />
          </div>
          {sideBarHtml}
        </div>
      </React.Fragment>
    );
  }
}

export default compose(
  withRouter,
  graphql(patientCarePlanGraphql, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
        glassBreakId: props.glassBreakId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      refetch: data ? data.refetch : null,
      carePlan: data ? (data as any).carePlanForPatient : null,
    }),
  }),
  graphql(taskIdsWithNotificationsGraphql, {
    options: { fetchPolicy: 'network-only' },
    props: ({ data }) => {
      let taskIdsWithNotifications: string[] | null = null;
      if (data) {
        const response = (data as any).taskIdsWithNotifications;

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
)(PatientMap) as React.ComponentClass<IProps>;
