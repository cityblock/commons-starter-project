import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { getClinicsQuery } from '../graphql/types';
import * as styles from './css/progress-note-context.css';

interface IProps {
  clinics: getClinicsQuery['clinics'];
  progressNoteLocation: string;
  onLocationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function getLocations(clinics: getClinicsQuery['clinics']) {
  const locations = ["Patient's Home"];
  // Add clinics
  const clinicItems = clinics && clinics.edges ? clinics.edges : [];
  clinicItems.forEach(item => locations.push(item.node.name));
  // Add other
  locations.push('Other');
  return locations;
}

export const ProgressNoteLocation: React.StatelessComponent<IProps> = props => {
  const { progressNoteLocation, onLocationChange, clinics } = props;
  const progressNoteLocations = getLocations(clinics).map(location => (
    <option key={location} value={location}>
      {location}
    </option>
  ));
  return (
    <div className={styles.location}>
      <FormattedMessage id="progressNote.selectLocation">
        {(message: string) => <div className={styles.encounterTypeLabel}>{message}</div>}
      </FormattedMessage>
      <select
        value={progressNoteLocation || ''}
        onChange={onLocationChange}
        className={styles.encounterTypeSelect}
      >
        <option value={''} disabled hidden>
          Select a location
        </option>
        {progressNoteLocations}
      </select>
    </div>
  );
};
