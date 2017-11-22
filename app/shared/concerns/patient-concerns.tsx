import * as React from 'react';
import { FullPatientConcernFragment } from '../../graphql/types';
import DnDPatientConcern from '../../patient-profile-container/drag-and-drop/patient-concern';
import EmptyPlaceholder from '../library/empty-placeholder/empty-placeholder';

interface IProps {
  concerns: FullPatientConcernFragment[];
  selectedPatientConcernId: string;
  optionsDropdownConcernId: string;
  inactive?: boolean;
  onClick: (id: string) => void;
  onOptionsToggle: (id: string) => (e: React.MouseEvent<HTMLDivElement>) => void;
  selectedTaskId: string;
}

const PatientConcerns: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    selectedPatientConcernId,
    optionsDropdownConcernId,
    concerns,
    inactive,
    onClick,
    onOptionsToggle,
    selectedTaskId,
  } = props;

  if (inactive && !concerns.length) {
    return (
      <EmptyPlaceholder
        headerMessageId="patientMap.emptyNextUpHeader"
        detailMessageId="patientMap.emptyNextUpDetail"
      />
    );
  }

  const renderedConcerns = concerns.map((concern, index) => {
    const selected = !!selectedPatientConcernId && selectedPatientConcernId === concern.id;
    const optionsOpen = optionsDropdownConcernId === concern.id;

    return (
      <DnDPatientConcern
        key={concern.id}
        selected={selected}
        patientConcern={concern}
        onClick={() => onClick(concern.id)}
        onOptionsToggle={onOptionsToggle(concern.id)}
        optionsOpen={optionsOpen}
        inactive={inactive || false}
        selectedTaskId={selectedTaskId}
      />
    );
  });

  return <div>{renderedConcerns}</div>;
};

export default PatientConcerns;
