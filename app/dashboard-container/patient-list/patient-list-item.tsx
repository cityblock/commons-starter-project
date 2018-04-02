import * as classNames from 'classnames';
import { History } from 'history';
import { capitalize } from 'lodash';
import * as React from 'react';
import { withRouter } from 'react-router';
import { FullPatientForDashboardFragment } from '../../graphql/types';
import { formatCityblockId, formatFullName, getPatientStatusColor } from '../../shared/helpers/format-helpers';
import { getActiveMapRoute } from '../../shared/helpers/route-helpers';
import Icon from '../../shared/library/icon/icon';
import PatientAge from '../../shared/library/patient-age/patient-age';
import PatientPhoto from '../../shared/library/patient-photo/patient-photo';
import SmallText from '../../shared/library/small-text/small-text';
import PatientTaskCount from '../tasks/patient-task-count';
import * as styles from './css/patient-list-item.css';
import PatientIntakeProgressBar from './patient-intake-progress-bar';

interface IContainerProps {
  className: string;
  onClick?: () => void;
}

export type DisplayOptions = 'task' | 'progress' | 'default';

interface IProps {
  patient: FullPatientForDashboardFragment;
  displayType?: DisplayOptions; // optional body view option
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
  const { patient, displayType, tasksDueCount, notificationsCount, selected, history } = props;

  const redirectToPatient = () => {
    history.push(getActiveMapRoute(patient.id));
  };

  const containerStyles = classNames(styles.container, {
    [styles.sticky]: !!selected,
  });

  const containerProps: IContainerProps = {
    className: containerStyles,
  };

  if (displayType !== 'task') {
    containerProps.onClick = redirectToPatient;
  }

  const { gender, hasUploadedPhoto } = patient.patientInfo;

  let itemBody;
  if (displayType === 'task') {
    itemBody = (
      <PatientTaskCount
        tasksDueCount={tasksDueCount as number | null}
        notificationsCount={notificationsCount as number | null}
      />
    );
  } else if (displayType === 'progress') {
    itemBody = <PatientIntakeProgressBar computedPatientStatus={patient.computedPatientStatus} />;
  } else {
    itemBody = <PatientAge dateOfBirth={patient.dateOfBirth} gender={gender} />;
  }

  const patientStatus = capitalize(patient.patientState.currentState);
  const statusColor = getPatientStatusColor(patient.patientState.currentState);
  return (
    <div {...containerProps}>
      <div className={styles.patient}>
        <PatientPhoto
          patientId={patient.id}
          gender={gender}
          hasUploadedPhoto={!!hasUploadedPhoto}
          type="circle"
        />
        <h4>{formatFullName(patient.firstName, patient.lastName)}</h4>
      </div>
      <div className={styles.info}>
        <SmallText text={formatCityblockId(patient.cityblockId)} color="black" />
        <SmallText text={patientStatus} color={statusColor} />
        {itemBody}
        <div onClick={redirectToPatient} className={styles.profileLink}>
          <Icon name="keyboardArrowRight" className={styles.arrow} />
        </div>
      </div>
    </div>
  );
};

export default withRouter<IProps>(PatientListItem);
