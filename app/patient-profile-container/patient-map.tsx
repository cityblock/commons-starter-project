import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { ICarePlan } from 'schema';
import Task from '../shared/task';
import { IState as IAppState } from '../store';
import * as styles from './css/patient-map.css';
import PatientCarePlan from './patient-care-plan';

interface IStateProps {
  taskId?: string;
}

interface IOwnProps {
  patientId: string;
  loading?: boolean;
  routeBase: string;
  carePlan?: ICarePlan;
}

type IProps = IStateProps & IOwnProps;

export const PatientMap: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patientId, loading, routeBase, carePlan, taskId } = props;

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
    <div className={styles.container}>
      <div className={mainStyles}>
        <PatientCarePlan
          loading={loading}
          carePlan={carePlan}
          routeBase={routeBase}
          patientId={patientId}
        />
      </div>
      <div className={sideBarStyles}>{taskId && <Task routeBase={routeBase} />}</div>
    </div>
  );
};

const mapStateToProps = (state: IAppState): IStateProps => ({
  taskId: state.task.taskId || '',
});

export default connect<IStateProps, {}, IOwnProps>(mapStateToProps)(PatientMap);
