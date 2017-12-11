import * as classNames from 'classnames';
import * as React from 'react';
import { FullAnswerFragment, FullQuestionFragment } from '../../graphql/types';
import * as formStyles from '../css/forms.css';
import * as styles from './patient-question.css';

interface IProps {
  editable: boolean;
  currentAnswer: { id: string; value: string };
  question: FullQuestionFragment;
  onChange: (
    questionId: string,
    answers: Array<{ answerId: string; value: string | number }>,
  ) => any;
}

export default class RadioAnswer extends React.Component<IProps, {}> {
  renderRadioItem = (answer: FullAnswerFragment, index: number) => {
    const { question, currentAnswer, onChange, editable } = this.props;

    const labelStyles = classNames(formStyles.radioLabel, styles.radioLabel);
    return (
      <div key={`${answer.id}-${index}`} className={styles.radioGroupItem}>
        <div className={formStyles.radioGroupContainer}>
          <input
            disabled={!editable}
            className={formStyles.radio}
            type="radio"
            onChange={event =>
              onChange(question.id, [{ answerId: answer.id, value: answer.value }])
            }
            checked={!!currentAnswer && currentAnswer.id === answer.id}
            value={answer.id}
          />
          <label className={styles.radioFill} />
        </div>
        <span
          className={labelStyles}
          onClick={() => onChange(question.id, [{ answerId: answer.id, value: answer.value }])}
        >
          {answer.displayValue}
        </span>
      </div>
    );
  };

  render() {
    const { question } = this.props;
    const answers = question.answers || [];

    return (
      <div className={classNames(styles.questionBody, styles.noBottomPadding)}>
        <div className={formStyles.radioGroup}>
          <div className={classNames(formStyles.radioGroupOptions, styles.radioGroup)}>
            {answers.map(this.renderRadioItem)}
          </div>
        </div>
      </div>
    );
  }
}
