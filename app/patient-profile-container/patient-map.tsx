import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as patientCarePlanQuery from '../graphql/queries/get-patient-care-plan.graphql';
/* tslint:enable:max-line-length */
import { getPatientCarePlanQuery } from '../graphql/types';
import Task from '../shared/task/task';
import * as styles from './css/patient-map.css';
import DnDPatientCarePlan from './drag-and-drop/patient-care-plan';
import MapModals from './modals/modals';

interface IDispatchProps {
  closeTask?: () => void;
}

export interface IProps {
  patientId: string;
  loading?: boolean;
  routeBase: string;
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  taskId: string | null;
}

interface IGraphqlProps {
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  loading?: boolean;
  error?: string | null;
}

export type allProps = IDispatchProps & IGraphqlProps & IProps;

export class PatientMap extends React.Component<allProps, {}> {
  closeTask = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (this.props.taskId && this.props.closeTask) {
      this.props.closeTask();
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
    const { patientId, loading, routeBase, carePlan, taskId } = this.props;

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

const mapDispatchToProps = (dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps => ({
  closeTask: () => dispatch(push(ownProps.routeBase)),
});

export default compose(
  connect<{}, IDispatchProps, IProps>(null, mapDispatchToProps),
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
)(PatientMap);
