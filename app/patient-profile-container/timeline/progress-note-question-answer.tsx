import React from 'react';
import { FullPatientAnswer } from '../../graphql/types';
import styles from './css/progress-note-question-answer.css';

interface IProps {
  answer: FullPatientAnswer;
}

export const ProgressNoteQuestionAnswer: React.StatelessComponent<IProps> = props => {
  const { answer } = props;
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {answer.question ? answer.question.title : 'question title'}
      </div>
      <div className={styles.answer}>{answer.answerValue}</div>
    </div>
  );
};
