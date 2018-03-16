import * as React from 'react';
import { FullPatientForProfileFragment } from '../../../graphql/types';
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

// TODO: Remove hard coded values
const Plan: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOpen, onClick } = props;

  return (
    <div className={styles.container}>
      <InfoGroupHeader selected="plan" isOpen={isOpen} onClick={onClick} />
      <InfoGroupContainer isOpen={isOpen}>
        <InfoGroupItem labelMessageId="plan.cityblockId" value="CBH-1230811" />
        <InfoGroupItem labelMessageId="plan.insurance" value="EmblemHealth" />
        <InfoGroupItem labelMessageId="plan.planId" value="EMB1234567" />
        <InfoGroupItem labelMessageId="plan.planType" value="Medicaid" />
        <InfoGroupItem labelMessageId="plan.cin" value="AA-AAAA-12" />
      </InfoGroupContainer>
    </div>
  );
};

export default Plan;
