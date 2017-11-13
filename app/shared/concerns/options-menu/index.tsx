import * as React from 'react';
import * as styles from '../css/concern-options-menu.css';
import PatientConcernOption from './option';

export const Divider: React.StatelessComponent<{}> = () => <div className={styles.border} />;

interface IProps {
  inactive: boolean;
}

const PatientConcernOptions: React.StatelessComponent<IProps> = ({ inactive }) => {
  const sendToLabel = inactive ? "Send to Active" : "Send to Next Up";
  const sendToIcon = inactive ? "play" : "nextUp";
  const sendToOption = <PatientConcernOption label={sendToLabel} icon={sendToIcon} />;

  return (
    <div className={styles.container}>
      <PatientConcernOption label="Add a new goal" icon="add" />
      <Divider />
      <PatientConcernOption label="Share Concern URL" icon="share" />
      <Divider />
      <PatientConcernOption label="Reorder Concerns" icon="reorder" />
      <Divider />
      {sendToOption}
      <Divider />
      <PatientConcernOption label="Edit Concern" icon="edit" />
    </div>
  );
};

PatientConcernOptions.displayName = 'PatientConcernOptions';

export default PatientConcernOptions;
