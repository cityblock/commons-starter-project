import { format } from 'date-fns';
import { capitalize } from 'lodash';
import * as React from 'react';
import { FullPatientForProfileFragment } from '../../../graphql/types';
import { Selected } from '../left-nav';
import InfoGroupContainer from './container';
import * as styles from './css/shared.css';
import InfoGroupHeader from './header';
import InfoGroupItem from './item';

const DATE_OF_BIRTH_FORMAT = 'MMM D, YYYY';

interface IProps {
  isOpen: boolean;
  onClick: (clicked: Selected) => void;
  patient: FullPatientForProfileFragment;
}

const Demographics: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOpen, onClick, patient } = props;
  const { gender, sexAtBirth } = patient.patientInfo;

  const formattedDateOfBirth = patient.dateOfBirth
    ? format(patient.dateOfBirth, DATE_OF_BIRTH_FORMAT)
    : null;
  const formattedGender = gender ? capitalize(gender) : null;
  const formattedAssignedSex = sexAtBirth ? capitalize(sexAtBirth) : null;

  return (
    <div className={styles.container}>
      <InfoGroupHeader selected="demographics" isOpen={isOpen} onClick={onClick} />
      <InfoGroupContainer isOpen={isOpen}>
        <InfoGroupItem labelMessageId="demographics.dateOfBirth" value={formattedDateOfBirth} />
        <InfoGroupItem labelMessageId="demographics.gender" value={formattedGender} />
        <InfoGroupItem labelMessageId="demographics.assignedSex" value={formattedAssignedSex} />
      </InfoGroupContainer>
    </div>
  );
};

export default Demographics;
