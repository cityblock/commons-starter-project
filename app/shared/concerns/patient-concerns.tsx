import * as React from 'react';
import { FullPatientConcernFragment } from '../../graphql/types';
import EmptyPlaceholder from '../library/empty-placeholder/empty-placeholder';
import PatientConcern from './concern';

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
      <PatientConcern
        key={concern.id}
        selected={selected}
        patientConcern={concern}
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        optionsOpen={optionsOpen}
        inactive={inactive}
        selectedTaskId={selectedTaskId}
      />
    );
  });

  return <div>{renderedConcerns}</div>;
};

export default PatientConcerns;
