import React from 'react';
import { FullPatientForProfile } from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import Text from '../../shared/library/text/text';
import styles from './css/preferred-name.css';

interface IProps {
  patient: FullPatientForProfile;
}

const LeftNavPreferredName: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patient } = props;
  const { preferredName } = patient.patientInfo;

  if (!preferredName || patient.firstName === preferredName) return null;

  return (
    <div className={styles.container}>
      <Text messageId="patientInfo.preferredName" color="gray" size="large" />
      <div className={styles.flex}>
        <Icon name="errorOutline" color="red" className={styles.icon} />
        <Text text={preferredName} isBold color="black" size="large" />
      </div>
    </div>
  );
};

export default LeftNavPreferredName;
