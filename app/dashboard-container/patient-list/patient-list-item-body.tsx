import { capitalize } from 'lodash';
import * as React from 'react';
import { FullPatientForDashboardFragment } from '../../graphql/types';
import { formatCityblockId, getPatientStatusColor } from '../../shared/helpers/format-helpers';
import Icon from '../../shared/library/icon/icon';
import PatientAge from '../../shared/library/patient-age/patient-age';
import SmallText from '../../shared/library/small-text/small-text';
import PatientTaskCount from '../tasks/patient-task-count';
import * as styles from './css/patient-list-item-body.css';
import PatientIntakeProgressBar from './patient-intake-progress-bar';
import PatientLatestSmsMessage from './patient-latest-sms-message';
import { DisplayOptions } from './patient-list-item';

interface IProps {
  patient: FullPatientForDashboardFragment;
  onClick: () => void;
  displayType?: DisplayOptions; // optional body view option
  tasksDueCount?: number | null; // number of tasks due, only for task view
  notificationsCount?: number | null; // number of tasks with notifications, only for task view
}

const PatientListItemBody: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patient, onClick, tasksDueCount, notificationsCount, displayType } = props;
  const { gender } = patient.patientInfo;
  const patientStatus = capitalize(patient.patientState.currentState);
  const statusColor = getPatientStatusColor(patient.patientState.currentState);
  const isNotConversations = displayType !== 'conversations';

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
  } else if (displayType === 'conversations') {
    itemBody = <PatientLatestSmsMessage patientId={patient.id} />;
  } else {
    itemBody = <PatientAge dateOfBirth={patient.dateOfBirth} gender={gender} />;
  }

  return (
    <div className={styles.info}>
      {isNotConversations && (
        <SmallText text={formatCityblockId(patient.cityblockId)} color="black" />
      )}
      {isNotConversations && <SmallText text={patientStatus} color={statusColor} />}
      {itemBody}
      <div onClick={onClick} className={styles.profileLink}>
        <Icon name="keyboardArrowRight" className={styles.arrow} />
      </div>
    </div>
  );
};

export default PatientListItemBody;
