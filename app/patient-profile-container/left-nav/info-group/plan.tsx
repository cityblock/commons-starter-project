import React from 'react';
import { FullPatientForProfileFragment } from '../../../graphql/types';
import { formatCityblockId } from '../../../shared/helpers/format-helpers';
import { Accordion } from '../left-nav';
import InfoGroupContainer from './container';
import styles from './css/shared.css';
import InfoGroupHeader from './header';
import InfoGroupItem from './item';

interface IProps {
  isOpen: boolean;
  onClick: (clicked: Accordion) => void;
  patient: FullPatientForProfileFragment;
}

// TODO: Remove hard coded values
const Plan: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOpen, onClick, patient } = props;
  const formattedCityblockId = formatCityblockId(patient.cityblockId);

  return (
    <div className={styles.container}>
      <InfoGroupHeader selected="plan" isOpen={isOpen} onClick={onClick} />
      <InfoGroupContainer isOpen={isOpen}>
        <InfoGroupItem labelMessageId="plan.cityblockId" value={formattedCityblockId} />
        <InfoGroupItem labelMessageId="plan.insurance" value="EmblemHealth" />
        <InfoGroupItem labelMessageId="plan.planId" value="EMB1234567" />
        <InfoGroupItem labelMessageId="plan.planType" value="Medicaid" />
        <InfoGroupItem labelMessageId="plan.cin" value="AA-AAAA-12" />
      </InfoGroupContainer>
    </div>
  );
};

export default Plan;
