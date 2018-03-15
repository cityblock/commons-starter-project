import { capitalize } from 'lodash';
import * as React from 'react';
import { FullPatientForProfileFragment } from '../../../graphql/types';
import { formatDateOfBirth } from '../../../shared/helpers/format-helpers';
import { Selected } from '../left-nav';
import InfoGroupContainer from './container';
import * as styles from './css/shared.css';
import InfoGroupHeader from './header';
import InfoGroupItem from './item';

interface IProps {
  isOpen: boolean;
  onClick: (clicked: Selected) => void;
  patient: FullPatientForProfileFragment;
}

const Demographics: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOpen, onClick, patient } = props;
  const { gender, sexAtBirth } = patient.patientInfo;

  const formattedGender = gender ? capitalize(gender) : '';
  const formattedAssignedSex = sexAtBirth ? capitalize(sexAtBirth) : '';

  return (
    <div className={styles.container}>
      <InfoGroupHeader selected="demographics" isOpen={isOpen} onClick={onClick} />
      <InfoGroupContainer isOpen={isOpen}>
        <InfoGroupItem
          labelMessageId="demographics.dateOfBirth"
          value={formatDateOfBirth(patient.dateOfBirth)}
        />
        <InfoGroupItem labelMessageId="demographics.gender" value={formattedGender} />
        <InfoGroupItem labelMessageId="demographics.assignedSex" value={formattedAssignedSex} />
      </InfoGroupContainer>
    </div>
  );
};

export default Demographics;
