import classNames from 'classnames';
import React from 'react';
import { FormattedDate } from 'react-intl';
import { FullPatientAnswerEvent } from '../../graphql/types';
import { formatPatientAnswer } from '../helpers/format-helpers';
import styles from './css/progress-note-activity.css';

interface IProps {
  patientAnswerEvent: FullPatientAnswerEvent;
  expanded: boolean;
}

class ProgressNoteActivityPatientAnswer extends React.Component<IProps> {
  getQuestionTitle = () => {
    const { patientAnswerEvent } = this.props;
    return patientAnswerEvent.patientAnswer.question
      ? patientAnswerEvent.patientAnswer.question.title
      : '';
  };

  renderPreviousAnswer = () => {
    const { patientAnswerEvent } = this.props;
    const { previousPatientAnswer } = patientAnswerEvent;
    const labelStyles = classNames(styles.answerLabel, styles.previous);
    const labelDate = previousPatientAnswer ? (
      <FormattedDate
        value={previousPatientAnswer.createdAt}
        year="numeric"
        month="short"
        day="numeric"
      />
    ) : null;
    const answerText = previousPatientAnswer ? (
      <div className={styles.previousAnswerText}>{formatPatientAnswer(previousPatientAnswer)}</div>
    ) : (
      <div className={styles.noPreviousAnswer}>
        <div className={styles.noPreviousAnswerLabel}>N/A</div>
        <div className={styles.noPreviousAnswerText}>[ new question ]</div>
      </div>
    );

    return (
      <div className={classNames(styles.answer, styles.borderRight)}>
        <div className={labelStyles}>
          <div className={styles.answerLabelText}>Previous answer:</div>
          <div className={styles.answerLabelDate}>{labelDate}</div>
        </div>
        <div className={styles.answerBody}>{answerText}</div>
      </div>
    );
  };

  renderCurrentAnswer = () => {
    const { patientAnswerEvent } = this.props;
    const { patientAnswer } = patientAnswerEvent;
    const labelStyles = classNames(styles.answerLabel, styles.current);
    return (
      <div className={styles.answer}>
        <div className={labelStyles}>
          <div className={styles.answerLabelText}>Updated answer:</div>
        </div>
        <div className={styles.answerBody}>
          <div className={styles.answerText}>{formatPatientAnswer(patientAnswer)}</div>
        </div>
      </div>
    );
  };

  render() {
    const { expanded } = this.props;
    const title = this.getQuestionTitle();
    const patientAnswerStyles = classNames(styles.patientAnswer, {
      [styles.expanded]: expanded,
    });

    return (
      <div className={patientAnswerStyles}>
        <div className={styles.questionTitle}>{title}</div>
        <div className={styles.answerDetails}>
          <div className={styles.previousAnswerDetails}>{this.renderPreviousAnswer()}</div>
          <div className={styles.currentAnswerDetails}>{this.renderCurrentAnswer()}</div>
        </div>
      </div>
    );
  }
}

export default ProgressNoteActivityPatientAnswer;
