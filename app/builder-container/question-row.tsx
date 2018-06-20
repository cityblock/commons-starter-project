import classNames from 'classnames';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullQuestion } from '../graphql/types';
import questionsStyles from '../shared/css/two-panel.css';
import styles from './css/risk-area-row.css';

interface IProps {
  question: FullQuestion;
  selected: boolean;
  routeBase: string;
}

export const QuestionRow: React.StatelessComponent<IProps> = props => {
  const { question, selected, routeBase } = props;
  const questionClass = classNames(styles.container, {
    [styles.selected]: selected,
  });
  const formattedCreatedAt = question.createdAt ? (
    <FormattedRelative value={question.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  ) : null;
  return (
    <Link className={questionClass} to={`${routeBase}/${question.id}`}>
      <div className={styles.title}>{question.title}</div>
      <div className={styles.meta}>
        <div className={classNames(questionsStyles.dateSection, questionsStyles.orderSection)}>
          <span className={styles.dateLabel}>Order:</span>
          <span className={styles.dateValue}>{question.order}</span>
        </div>
        <div className={classNames(questionsStyles.dateSection, questionsStyles.createdAtSection)}>
          <span className={styles.dateLabel}>Created:</span>
          {formattedCreatedAt}
        </div>
      </div>
    </Link>
  );
};
