import * as classNames from 'classnames';
import * as React from 'react';
import { getPatientCarePlanQuery } from '../graphql/types';
import Task from '../shared/task/task';
import * as styles from './css/patient-map.css';
import PatientCarePlan from './patient-care-plan';

export interface IProps {
  patientId: string;
  loading?: boolean;
  routeBase: string;
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  taskId?: string;
}

export const PatientMap: React.StatelessComponent<IProps> = props => {
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
      <div className={sideBarStyles}>
        {taskId && <Task routeBase={routeBase} taskId={taskId} />}
      </div>
    </div>
  );
};
