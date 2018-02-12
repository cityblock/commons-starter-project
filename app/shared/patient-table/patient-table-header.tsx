import * as classNames from 'classnames';
import * as React from 'react';
import Checkbox from '../library/checkbox/checkbox';
import * as styles from './css/patient-table.css';
import { PatientTableColumnHeader } from './helper-components';

interface IProps {
  onSelectToggle?: (isSelected: boolean) => any;
  isSelected?: boolean;
}

const PatientTableHeader: React.StatelessComponent<IProps> = (props: IProps) => {
  const { onSelectToggle, isSelected } = props;

  return (
    <div className={classNames(styles.headerContainer, { [styles.hasCheck]: !!onSelectToggle })}>
      {onSelectToggle && (
        <Checkbox
          onChange={e => onSelectToggle(e.target.checked)}
          isChecked={!!isSelected}
          className={styles.check}
        />
      )}
      <div className={styles.result}>
        <PatientTableColumnHeader messageId="patientTable.name" className={styles.name} />
        <PatientTableColumnHeader messageId="patientTable.status" className={styles.status} />
        <PatientTableColumnHeader messageId="patientTable.memberId" className={styles.memberId} />
        <PatientTableColumnHeader
          messageId="patientTable.dateOfBirth"
          className={styles.dateOfBirth}
        />
        <PatientTableColumnHeader messageId="patientTable.address" className={styles.address} />
      </div>
    </div>
  );
};

export default PatientTableHeader;
