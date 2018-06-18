import { format } from 'date-fns';
import React from 'react';
import { FullPatientForProfileFragment } from '../../../graphql/types';
import { Accordion } from '../left-nav';
import InfoGroupContainer from './container';
import styles from './css/shared.css';
import InfoGroupHeader from './header';
import InfoGroupItem from './item';

const DATE_OF_BIRTH_FORMAT = 'MMM D, YYYY';

interface IProps {
  isOpen: boolean;
  onClick: (clicked: Accordion) => void;
  patient: FullPatientForProfileFragment;
}

const Demographics: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOpen, onClick, patient } = props;
  const { gender, genderFreeText } = patient.patientInfo;

  const formattedDateOfBirth = patient.dateOfBirth
    ? format(patient.dateOfBirth, DATE_OF_BIRTH_FORMAT)
    : null;
  const genderMessageId = gender && !genderFreeText ? `gender.${gender}` : undefined;

  return (
    <div className={styles.container}>
      <InfoGroupHeader selected="demographics" isOpen={isOpen} onClick={onClick} />
      <InfoGroupContainer isOpen={isOpen}>
        <InfoGroupItem labelMessageId="demographics.dateOfBirth" value={formattedDateOfBirth} />
        <InfoGroupItem
          labelMessageId="demographics.gender"
          valueMessageId={genderMessageId}
          value={genderFreeText}
        />
      </InfoGroupContainer>
    </div>
  );
};

export default Demographics;
