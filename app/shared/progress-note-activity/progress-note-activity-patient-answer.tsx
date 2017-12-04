import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedDate } from 'react-intl';
import { FullPatientAnswerEventFragment } from '../../graphql/types';
import * as styles from './css/progress-note-activity.css';

interface IProps {
  patientAnswerEvent: FullPatientAnswerEventFragment;
  expanded: boolean;
}

class ProgressNoteActivityPatientAnswer extends React.Component<IProps> {
  getQuestionTitle = () => {
    const { patientAnswerEvent } = this.props;

    // TODO: Figure out if bad data is requiring this defensiveness or it's something else
    const question = patientAnswerEvent.patientAnswer.question;

    if (question) {
      return question.title;
    } else {
      return 'Unknown question text';
    }
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
      <div className={styles.previousAnswerText}>{previousPatientAnswer.answerValue}</div>
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
          <div className={styles.answerText}>{patientAnswer.answerValue}</div>
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
