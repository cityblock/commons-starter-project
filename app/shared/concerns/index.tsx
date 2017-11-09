import * as React from 'react';
import { FullPatientConcernFragment } from '../../graphql/types';
import PatientConcern from './concern';
import * as styles from './css/index.css';

interface IProps {
  concerns: FullPatientConcernFragment[];
  selectedPatientConcernId?: string;
  optionsDropdownConcernId?: string;
  inactive?: boolean;
  onClick: (id: string) => void;
  onOptionsToggle: (id: string) => (e: React.MouseEvent<HTMLDivElement>) => void;
}

const PatientConcerns: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    selectedPatientConcernId,
    optionsDropdownConcernId,
    concerns,
    inactive,
    onClick,
    onOptionsToggle,
  } = props;

  if (!concerns.length) {
    const label = inactive ? 'next up' : 'active';

    return (
      <div className={styles.emptyCarePlanSuggestionsContainer}>
        <div className={styles.emptyCarePlanSuggestionsLogo} />
        <div className={styles.emptyCarePlanSuggestionsLabel}>
          {`No ${label} concerns or goals for this patient`}
        </div>
        <div className={styles.emptyCarePlanSuggestionsSubtext}>
          New concerns and goals will be displayed here as they are added
        </div>
      </div>
    );
  }

  const renderedConcerns = concerns.map((concern, index) => {
    const selected =
      !inactive && index === 0 && selectedPatientConcernId === undefined
        ? true
        : selectedPatientConcernId === concern.id;
    const optionsOpen = optionsDropdownConcernId === concern.id;

    return (
      <PatientConcern
        key={concern.id}
        selected={selected}
        patientConcern={concern}
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        optionsOpen={optionsOpen}
        inactive={inactive}
      />
    );
  });

  return <div>{renderedConcerns}</div>;
};

export default PatientConcerns;
