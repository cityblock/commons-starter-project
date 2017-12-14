import * as React from 'react';
import { FullRiskAreaGroupFragment } from '../../graphql/types';
import * as styles from './css/risk-area-group-detail.css';
import RiskAreaGroupEdit from './risk-area-group-edit';

interface IProps {
  riskAreaGroup: FullRiskAreaGroupFragment | null;
  close: () => void;
}

const RiskAreaGroupDetail: React.StatelessComponent<IProps> = (props: IProps) => {
  const { riskAreaGroup, close } = props;

  if (!riskAreaGroup) return null;

  return (
    <div className={styles.container}>
      <RiskAreaGroupEdit riskAreaGroup={riskAreaGroup} close={close} />
    </div>
  );
};

export default RiskAreaGroupDetail;
