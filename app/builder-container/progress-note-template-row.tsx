import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullProgressNoteTemplateFragment } from '../graphql/types';
import * as progressNoteTemplatesStyles from '../shared/css/two-panel.css';
import * as styles from './css/risk-area-row.css';

interface IProps {
  progressNoteTemplate: FullProgressNoteTemplateFragment;
  selected: boolean;
  routeBase: string;
}

export const ProgressNoteTemplateRow: React.StatelessComponent<IProps> = props => {
  const { progressNoteTemplate, selected, routeBase } = props;
  const progressNoteTemplateClass = classNames(styles.container, {
    [styles.selected]: selected,
  });
  const formattedCreatedAt = progressNoteTemplate.createdAt ? (
    <FormattedRelative value={progressNoteTemplate.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  ) : null;
  return (
    <Link className={progressNoteTemplateClass} to={`${routeBase}/${progressNoteTemplate.id}`}>
      <div className={styles.title}>{progressNoteTemplate.title}</div>
      <div className={styles.meta}>
        <div
          className={classNames(
            progressNoteTemplatesStyles.dateSection,
            progressNoteTemplatesStyles.createdAtSection,
          )}
        >
          <span className={styles.dateLabel}>Created:</span>
          {formattedCreatedAt}
        </div>
      </div>
    </Link>
  );
};