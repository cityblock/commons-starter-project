import * as React from 'react';
import * as styles from './css/patient-medication.css';
import { IProblem } from './patient-problem-list';

interface IProps {
  problem: IProblem;
}

export default class PatientProblemListItem extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { problem } = this.props;
    return (
      <div className={styles.medication}>
        <div className={styles.medicationRow}>
          <div className={styles.medicationRowTitle}>{problem.name}</div>
        </div>
      </div>
    );
  }
}
