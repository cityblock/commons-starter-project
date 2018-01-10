import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/patient-medications.css';
import PatientProblem from './patient-problem-list-item';

interface IProps {
  patientId: string;
}

interface IState {
  loading?: boolean;
  error: string | null;
}

type allProps = IProps;

export interface IProblem {
  id: string;
  name: string;
}

const problems: IProblem[] = [
  {
    id: 'Trazodone',
    name: 'Trazodone',
  },
  {
    id: 'Tietze Syndrome',
    name: 'Tietze Syndrome',
  },
  {
    id: 'Anxiety',
    name: 'Anxiety',
  },
  {
    id: 'PTSD',
    name: 'PTSD',
  },
  {
    id: 'Major depressive disorder',
    name: 'Major depressive disorder',
  },
  {
    id: 'Obesity',
    name: 'Obesity',
  },
];

class PatientProblemList extends React.Component<allProps, IState> {
  renderPatientProblemList(meds: IProblem[]) {
    if (meds.length) {
      return meds.map(this.renderPatientProblemListItem);
    } else {
      return null;
    }
  }

  renderPatientProblemListItem(problem: IProblem) {
    return <PatientProblem key={problem.id} problem={problem} />;
  }

  render() {
    return (
      <div className={classNames(styles.patientMedications, styles.bottomMargin)}>
        <div className={styles.medicationsHeader}>
          <div className={styles.medicationsTitle}>Active problem list</div>
        </div>
        <div className={styles.medicationsList}>{this.renderPatientProblemList(problems)}</div>
      </div>
    );
  }
}

export default PatientProblemList;
