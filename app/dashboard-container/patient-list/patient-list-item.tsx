import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { withRouter } from 'react-router';
import { FullPatientForDashboardFragment } from '../../graphql/types';
import { formatFullName } from '../../shared/helpers/format-helpers';
import { getActiveMapRoute } from '../../shared/helpers/route-helpers';
import Avatar from '../../shared/library/avatar/avatar';
import Icon from '../../shared/library/icon/icon';
import PatientAge from '../../shared/library/patient-age/patient-age';
import PatientTaskCount from '../tasks/patient-task-count';
import * as styles from './css/patient-list-item.css';

interface IContainerProps {
  className: string;
  onClick?: () => void;
}

interface IProps {
  patient: FullPatientForDashboardFragment;
  taskView?: boolean; // optional flag if viewing patient with urgent tasks
  tasksDueCount?: number | null; // number of tasks due, only for task view
  notificationsCount?: number | null; // number of tasks with notifications, only for task view
  selected?: boolean; // flag if patient is selected, applies sticky scroll styles
  history: History;
  location: History.LocationState;
  match: {
    isExact: boolean;
    params: null;
    path: string;
    url: string;
  };
}

export const PatientListItem: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patient, taskView, tasksDueCount, notificationsCount, selected, history } = props;

  const redirectToPatient = () => {
    history.push(getActiveMapRoute(patient.id));
  };

  const containerStyles = classNames(styles.container, {
    [styles.sticky]: !!selected,
  });

  const containerProps: IContainerProps = {
    className: containerStyles,
  };

  if (!taskView) {
    containerProps.onClick = redirectToPatient;
  }

  const itemBody = !!taskView ? (
    <PatientTaskCount
      tasksDueCount={tasksDueCount as number | null}
      notificationsCount={notificationsCount as number | null}
    />
  ) : (
    <PatientAge dateOfBirth={patient.dateOfBirth} gender={patient.patientInfo.gender} />
  );

  return (
    <div {...containerProps}>
      <div className={styles.patient}>
        <Avatar borderColor="lightGray" />
        <h4>{formatFullName(patient.firstName, patient.lastName)}</h4>
      </div>
      <div className={styles.info}>
        <p>CBH-1234567</p>
        {itemBody}
        <div onClick={redirectToPatient} className={styles.profileLink}>
          <Icon name="keyboardArrowRight" className={styles.arrow} />
        </div>
      </div>
    </div>
  );
};

export default withRouter<IProps>(PatientListItem);
