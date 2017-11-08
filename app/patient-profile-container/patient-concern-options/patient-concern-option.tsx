import * as React from 'react';
import * as styles from '../css/patient-concern-options.css';

const getClassName = (icon: string) => {
  switch (icon) {
    case 'add':
      return styles.addIcon;
    case 'edit':
      return styles.editIcon;
    case 'nextUp':
      return styles.nextUpIcon;
    case 'reorder':
      return styles.reorderIcon;
    case 'share':
      return styles.shareIcon;
    default:
      return '';
  }
};

interface IProps {
  label: string;
  icon: string;
}

const PatientConcernOption: React.StatelessComponent<IProps> = ({ label, icon }) => (
  <div className={styles.option}>
    <i className={getClassName(icon)} />
    <p>{label}</p>
  </div>
);

PatientConcernOption.displayName = 'PatientConcernOption';

export default PatientConcernOption;
