import * as React from 'react';
import { getClinicsQuery } from '../graphql/types';
import FormLabel from '../shared/library/form-label/form-label';
import Select from '../shared/library/select/select';
import * as styles from './css/progress-note-context.css';

interface IProps {
  disabled: boolean;
  clinics: getClinicsQuery['clinics'];
  progressNoteLocation: string;
  onLocationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function getLocations(clinics: getClinicsQuery['clinics']): string[] {
  const clinicItems = clinics && clinics.edges ? clinics.edges : [];
  const locations = clinicItems.map(item => item.node.name);

  locations.push(
    'Member’s home',
    'Community',
    'Outside appointment',
    'CBO or social service agency',
    'Other',
  );

  return locations;
}

export const ProgressNoteLocation: React.StatelessComponent<IProps> = props => {
  const { progressNoteLocation, onLocationChange, clinics, disabled } = props;
  const progressNoteLocations = getLocations(clinics).map(location => (
    <option key={location} value={location}>
      {location}
    </option>
  ));
  return (
    <div className={styles.location}>
      <FormLabel messageId="progressNote.selectLocation" />
      <Select value={progressNoteLocation || ''} onChange={onLocationChange} disabled={disabled}>
        <option value={''} disabled hidden>
          Select a location
        </option>
        {progressNoteLocations}
      </Select>
    </div>
  );
};
