import classNames from 'classnames';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullComputedFieldFragment } from '../graphql/types';
import computedFieldStyles from '../shared/css/two-panel.css';
import styles from './css/risk-area-row.css';

interface IProps {
  computedField: FullComputedFieldFragment;
  selected: boolean;
  routeBase: string;
}

export const ComputedFieldRow: React.StatelessComponent<IProps> = props => {
  const { computedField, selected, routeBase } = props;
  const computedFieldClass = classNames(styles.container, {
    [styles.selected]: selected,
  });
  const metaStyles = classNames(
    computedFieldStyles.dateSection,
    computedFieldStyles.createdAtSection,
  );
  const formattedCreatedAt = computedField.createdAt ? (
    <FormattedRelative value={computedField.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  ) : null;
  return (
    <Link className={computedFieldClass} to={`${routeBase}/${computedField.id}`}>
      <div className={styles.title}>{computedField.label}</div>
      <div className={styles.meta}>
        <div className={metaStyles}>
          <span className={styles.dateLabel}>Created:</span>
          {formattedCreatedAt}
        </div>
      </div>
    </Link>
  );
};
