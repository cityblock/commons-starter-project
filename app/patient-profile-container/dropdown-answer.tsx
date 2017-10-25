import * as classNames from 'classnames';
import * as React from 'react';
import { FullAnswerFragment, FullQuestionFragment } from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as styles from './css/risk-areas.css';

interface IProps {
  currentAnswer: { id: string; value: string };
  question: FullQuestionFragment;
  onChange: (questionId: string, answerId: string, value: string | number) => any;
}

export default class DropdownAnswer extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderDropdownOption = this.renderDropdownOption.bind(this);
    this.onDropdownChange = this.onDropdownChange.bind(this);
  }

  renderDropdownOption(answer: FullAnswerFragment, index: number) {
    return (
      <option key={`${answer.id}-${index}`} value={answer.value}>
        {answer.displayValue}
      </option>
    );
  }

  onDropdownChange(value: string | number) {
    const { question, onChange } = this.props;

    const chosenAnswer = (question.answers || []).find(answer => answer.value === value);

    if (chosenAnswer) {
      onChange(question.id, chosenAnswer.id, value);
    }
  }

  render() {
    const { question, currentAnswer } = this.props;
    const answers = question.answers || [];

    return (
      <div className={styles.riskAssessmentQuestionBody}>
        <select
          value={currentAnswer ? currentAnswer.value : 'Select one'}
          onChange={event => this.onDropdownChange(event.currentTarget.value)}
          className={classNames(formStyles.select, styles.select)}
        >
          <option value={'Select one'} disabled={true}>
            Select one
          </option>
          {answers.map(this.renderDropdownOption)}
        </select>
      </div>
    );
  }
}
