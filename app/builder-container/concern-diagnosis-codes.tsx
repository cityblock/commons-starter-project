import * as React from 'react';
import { FullDiagnosisCodeFragment } from '../graphql/types';
import * as styles from '../shared/css/two-panel-right.css';
import SmallText from '../shared/library/small-text/small-text';
import ConcernDiagnosisCode from './concern-diagnosis-code';
import ConcernDiagnosisCodeCreate from './concern-diagnosis-code-create';

interface IProps {
  concernId: string;
  diagnosisCodes: FullDiagnosisCodeFragment[] | null;
}

export class ConcernDiagnosisCodes extends React.Component<IProps> {
  renderDiagnosisCodes() {
    const { diagnosisCodes, concernId } = this.props;

    if (!diagnosisCodes || !diagnosisCodes.length) {
      return <div className={styles.smallText}>No ICD-10 Codes</div>;
    }

    return diagnosisCodes.map(diagnosisCode => (
      <ConcernDiagnosisCode
        key={diagnosisCode.id}
        diagnosisCode={diagnosisCode}
        concernId={concernId}
      />
    ));
  }

  render() {
    const { concernId } = this.props;

    return (
      <div>
        <br />
        <SmallText messageId="concernDiagnosisCodes.icdTenCodes" />
        <br />
        {this.renderDiagnosisCodes()}
        <br />
        <SmallText messageId="concernDiagnosisCodes.addDiagnosisCode" />
        <ConcernDiagnosisCodeCreate concernId={concernId} />
        <br />
      </div>
    );
  }
}

export default ConcernDiagnosisCodes;
