import classNames from 'classnames';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullPatientList } from '../../graphql/types';
import sharedStyles from '../../shared/css/two-panel.css';
import styles from '../css/risk-area-row.css';

interface IProps {
  patientList: FullPatientList;
  routeBase: string;
  selected: boolean;
}

const PatientList: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patientList, routeBase, selected } = props;
  const containerStyles = classNames(styles.container, {
    [styles.selected]: selected,
  });
  const formattedCreatedAt = patientList.createdAt ? (
    <FormattedRelative value={patientList.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  ) : null;

  return (
    <Link className={containerStyles} to={`${routeBase}/${patientList.id}`}>
      <div className={styles.title}>{patientList.title}</div>
      <div className={styles.meta}>
        <div className={classNames(sharedStyles.dateSection, sharedStyles.orderSection)}>
          <span className={styles.dateLabel}>Answer Id:</span>
          <span className={styles.dateValue}>{patientList.answerId}</span>
        </div>
        <div className={classNames(sharedStyles.dateSection, sharedStyles.orderSection)}>
          <span className={styles.dateLabel}>Order:</span>
          <span className={styles.dateValue}>{patientList.order}</span>
        </div>
        <div className={classNames(sharedStyles.dateSection, sharedStyles.createdAtSection)}>
          <span className={styles.dateLabel}>Created:</span>
          {formattedCreatedAt}
        </div>
      </div>
    </Link>
  );
};

export default PatientList;
