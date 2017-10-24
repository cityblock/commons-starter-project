import * as classNames from 'classnames';
import * as React from 'react';
import { FullAnswerFragment, FullQuestionFragment } from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as styles from './css/risk-areas.css';

interface IProps {
  currentAnswer: { id: string; value: string; };
  question: FullQuestionFragment;
  onChange: (questionId: string, answerId: string, value: string | number) => any;
}

export default class RadioAnswer extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderRadioItem = this.renderRadioItem.bind(this);
  }

  renderRadioItem(answer: FullAnswerFragment, index: number) {
    const { question, currentAnswer, onChange } = this.props;

    const labelStyles = classNames(formStyles.radioLabel, styles.radioLabel);

    return (
      <div key={`${answer.id}-${index}`} className={styles.radioGroupItem}>
        <div className={formStyles.radioGroupContainer}>
          <input
            className={formStyles.radio}
            type='radio'
            onClick={event => onChange(question.id, answer.id, answer.value)}
            checked={!!currentAnswer && currentAnswer.id === answer.id}
            value={answer.value} />
          <label className={styles.radioFill} />
        </div>
        <span
          className={labelStyles}
          onClick={() => (onChange(question.id, answer.id, answer.value))}>
          {answer.displayValue}
        </span>
      </div>
    );
  }

  render() {
    const { question } = this.props;
    const answers = question.answers || [];

    return (
      <div className={classNames(styles.riskAssessmentQuestionBody, styles.noBottomPadding)}>
        <div className={formStyles.radioGroup}>
          <div className={classNames(formStyles.radioGroupOptions, styles.radioGroup)}>
            {answers.map(this.renderRadioItem)}
          </div>
        </div>
      </div>
    );
  }
}
