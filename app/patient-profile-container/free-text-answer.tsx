import * as React from 'react';
import { FullQuestionFragment } from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as styles from './css/risk-areas.css';

interface IProps {
  currentAnswer: { id: string; value: string; };
  question: FullQuestionFragment;
  onChange: (questionId: string, answerId: string, value: string | number) => any;
}

export default class FreeTextAnswer extends React.Component<IProps, {}> {
  render() {
    const { question, currentAnswer, onChange} = this.props;
    const answers = question.answers || [];

    // This is a weird answer type. Return nothing if there are no answers associated with it.
    const answer = answers[0];

    if (answers) {
      const answerId = answer.id;

      return (
        <div className={styles.riskAssessmentQuestionBody}>
          <div className={styles.textArea}>
            <textarea
              value={currentAnswer ? currentAnswer.value : ''}
              onChange={event => onChange(question.id, answerId, event.target.value)}
              className={formStyles.textarea} />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
