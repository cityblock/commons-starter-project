import * as React from 'react';
import { FullPatientForProfileFragment } from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/preferred-name.css';

interface IProps {
  patient: FullPatientForProfileFragment;
}

const LeftNavPreferredName: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patient } = props;
  const { preferredName } = patient.patientInfo;

  if (!preferredName || patient.firstName === preferredName) return null;

  return (
    <div className={styles.container}>
      <SmallText messageId="patientInfo.preferredName" color="gray" size="large" />
      <div className={styles.flex}>
        <Icon name="errorOutline" color="red" className={styles.icon} />
        <SmallText text={preferredName} isBold color="black" size="large" />
      </div>
    </div>
  );
};

export default LeftNavPreferredName;
