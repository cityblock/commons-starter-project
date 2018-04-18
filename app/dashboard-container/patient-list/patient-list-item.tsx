import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { withRouter } from 'react-router';
import { FullPatientForDashboardFragment } from '../../graphql/types';
import { formatFullName } from '../../shared/helpers/format-helpers';
import { getActiveMapRoute } from '../../shared/helpers/route-helpers';
import PatientPhoto from '../../shared/library/patient-photo/patient-photo';
import * as styles from './css/patient-list-item.css';
import PatientListItemBody from './patient-list-item-body';

interface IContainerProps {
  className: string;
  onClick?: () => void;
}

export type DisplayOptions = 'task' | 'conversations' | 'progress' | 'default';

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
      <PatientListItemBody
        patient={patient}
        onClick={redirectToPatient}
        displayType={displayType}
        tasksDueCount={tasksDueCount}
        notificationsCount={notificationsCount}
      />
    </div>
  );
};

export default withRouter<IProps>(PatientListItem);
