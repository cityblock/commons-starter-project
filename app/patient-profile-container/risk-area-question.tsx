import * as classNames from 'classnames';
import * as React from 'react';
import { FullAnswerFragment, FullQuestionFragment } from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as styles from './css/risk-areas.css';

export interface IProps {
  question: FullQuestionFragment;
  editable: boolean;
}

export default class RiskAreaQuestion extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderSelectOption = this.renderSelectOption.bind(this);
    this.renderRadioItem = this.renderRadioItem.bind(this);
    this.renderCheckboxItem = this.renderCheckboxItem.bind(this);
    this.renderAnswers = this.renderAnswers.bind(this);
  }

  renderSelectOption(answer: FullAnswerFragment, index: number) {
    return (
      <option key={`${answer.id}-${index}`} value={answer.value}>{answer.displayValue}</option>
    );
  }

  renderRadioItem(answer: FullAnswerFragment, index: number) {
    const { editable } = this.props;

    return (
      <div key={`${answer.id}-${index}`} className={styles.radioGroupItem}>
        <div className={formStyles.radioGroupContainer}>
          <input
            disabled={!editable}
            className={formStyles.radio}
            type='radio'
            onChange={() => true}
            checked={false}
            value={answer.value} />
          <label />
        </div>
        <span className={formStyles.radioLabel}>{answer.displayValue}</span>
      </div>
    );
  }

  renderCheckboxItem(answer: FullAnswerFragment, index: number) {
    const { editable } = this.props;

    return (
      <div key={`${answer.id}-${index}`}>
        <input disabled={!editable} type='checkbox' value={answer.value} />
        <label>{answer.displayValue}</label>
      </div>
    );
  }

  renderAnswers() {
    const { question, editable } = this.props;
    const answers = question.answers || [];

    const selectStyles = classNames(formStyles.select, styles.select);
    const questionBodyStyles = classNames(styles.riskAssessmentQuestionBody, {
      [styles.noBottomPadding]: question.answerType === 'radio',
    });

    switch (question.answerType) {
      case 'dropdown':
        return (
          <div className={questionBodyStyles}>
            <select
              disabled={!editable}
              value={''}
              onChange={() => true}
              className={selectStyles}>
              {answers.map(this.renderSelectOption)}
            </select>
          </div>
        );
      case 'radio':
        return (
          <div className={questionBodyStyles}>
            <div className={formStyles.radioGroup}>
              <div className={classNames(formStyles.radioGroupOptions, styles.radioGroup)}>
                {answers.map(this.renderRadioItem)}
              </div>
            </div>
          </div>
        );
      case 'freetext':
        return (
          <div className={questionBodyStyles}>
            <div className={styles.textArea}>
              <textarea disabled={!editable} className={formStyles.textarea} />
            </div>
          </div>
        );
      case 'multiselect':
        return (
          <div className={questionBodyStyles}>
            {answers.map(this.renderCheckboxItem)}
          </div>
        );
      default:
        return <div>Invalid answer type</div>;
    }
  }

  render() {
    const { question } = this.props;

    return (
      <div className={styles.riskAssessmentQuestion}>
        <div className={styles.riskAssessmentQuestionHeader}>
          <div className={styles.riskAssessmentQuestionTitle}>{question.id}</div>
          <div className={styles.riskAssessmentQuestionLastUpdated}>
            <div className={styles.riskAssessmentQuestionLastUpdatedDate}>
              <div className={styles.lastUpdatedLabel}>Last updated:</div>
              <div className={styles.lastUpdatedValue}>Jan 1, 2017</div>
            </div>
            <div className={styles.riskAssessmentQuestionLastUpdater}>
              <div className={styles.riskAssessmentQuestionLastUpdaterName}>FirstName</div>
              <div className={styles.riskAssessmentQuestionLastUpdaterName}>LastName</div>
            </div>
          </div>
        </div>
        <div className={styles.riskAssessmentQuestionTitle}>{question.title}</div>
        {this.renderAnswers()}
        <div className={styles.riskAssessmentQuestionHistory}>
          <div className={styles.riskAssessmentQuestionHistoryLabel}>Previous answer:</div>
          <div className={styles.riskAssessmentQuestionHistoryText}>Not applicable</div>
        </div>
      </div>
    );
  }
}
