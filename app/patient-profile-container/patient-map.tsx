import * as classNames from 'classnames';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { getPatientCarePlanQuery } from '../graphql/types';
import Task from '../shared/task/task';
import * as styles from './css/patient-map.css';
import PatientCarePlan from './patient-care-plan';

export interface IProps {
  patientId: string;
  loading?: boolean;
  routeBase: string;
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  subSubTabId?: string;
}

interface IRouterProps {
  match?: {
    params?: {
      subSubTabId?: string;
    };
  };
}
type allProps = IProps & IRouterProps;

// stateless component not playing nicely with TS
export class PatientMap extends React.Component<allProps, {}> {
  render(): JSX.Element {
    const { patientId, loading, routeBase, carePlan, match } = this.props;
    const params = match && match.params;
    const taskId = params && params.subSubTabId;

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
  }
}

export default withRouter(PatientMap);
