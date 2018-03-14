import { capitalize } from 'lodash';
import * as React from 'react';
import { FullPatientForProfileFragment } from '../../graphql/types';
import { formatAge, formatPatientNameForProfile } from '../../shared/helpers/format-helpers';
import Avatar from '../../shared/library/avatar/avatar';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/header.css';
import PatientNeedToKnow from './patient-need-to-know';
import LeftNavPreferredName from './preferred-name';

interface IProps {
  patient: FullPatientForProfileFragment | null;
}

const LeftNavHeader: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patient } = props;

  if (!patient) return null;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <Avatar avatarType="patient" size="xxLarge" />
        <div className={styles.patient}>
          <SmallText
            text={capitalize(patient.patientState.currentState)}
            color="green"
            size="medium"
            isBold
          />
          <h1>{formatPatientNameForProfile(patient)}</h1>
          <SmallText
            messageId="patientInfo.age"
            messageValues={{ age: formatAge(patient.dateOfBirth) }}
            size="large"
            color="black"
            isBold
          />
        </div>
      </div>
      <div className={styles.needToKnow}>
        <div className={styles.divider} />
        <SmallText messageId="patientInfo.needToKnow" />
        <div className={styles.divider} />
      </div>
      <LeftNavPreferredName patient={patient} />
      <PatientNeedToKnow patientId={patient.id} />
    </div>
  );
};

export default LeftNavHeader;
