import * as classNames from 'classnames';
import * as React from 'react';
import { FullAnswerFragment, FullQuestionFragment } from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as styles from './css/risk-areas.css';
import RiskAreaMultiSelectAnswer from './risk-area-multi-select-answer';

export interface IProps {
  onChange: (questionId: string, answerId: string, value: string | number) => any;
  question: FullQuestionFragment;
  editable: boolean;
  answerData: {
    answers: Array<{
      id: string;
      value: string;
    }>;
    oldAnswers: Array<{
      id: string;
      value: string;
    }>;
    changed: boolean;
  };
}

export default class RiskAreaQuestion extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.onClickMultiSelect = this.onClickMultiSelect.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.renderSelectOption = this.renderSelectOption.bind(this);
    this.renderRadioItem = this.renderRadioItem.bind(this);
    this.renderMultiSelectItem = this.renderMultiSelectItem.bind(this);
    this.renderAnswers = this.renderAnswers.bind(this);
  }

  onChange(value: string | number, answerId: string | null) {
    if (answerId) {
      this.updateValue(value, answerId);
    }
  }

  onDropdownChange(value: string | number) {
    const { question } = this.props;

    const chosenAnswer = (question.answers || []).find(answer => answer.value === value);

    if (chosenAnswer) {
      this.onChange(value, chosenAnswer.id);
    }
  }

  onClickMultiSelect(value: string | number, answerId: string) {
    this.updateValue(value, answerId);
  }

  updateValue(value: string | number, answerId: string) {
    const { question, onChange, editable } = this.props;

    if (editable) {
      onChange(question.id, answerId, value);
    }
  }

  renderSelectOption(answer: FullAnswerFragment, index: number) {
    return (
      <option key={`${answer.id}-${index}`} data-answerId={answer.id} value={answer.value}>
        {answer.displayValue}
      </option>
    );
  }

  renderRadioItem(answer: FullAnswerFragment, index: number) {
    const { editable, answerData } = this.props;
    const defaultAnswerData = { answers: [], oldAnswers: [], changed: true };
    const currentAnswer = (answerData || defaultAnswerData).answers[0];

    const labelStyles = classNames(formStyles.radioLabel, styles.radioLabel);

    return (
      <div key={`${answer.id}-${index}`} className={styles.radioGroupItem}>
        <div className={formStyles.radioGroupContainer}>
          <input
            disabled={!editable}
            className={formStyles.radio}
            type='radio'
            onClick={event => this.onChange(answer.value, answer.id)}
            checked={!!currentAnswer && currentAnswer.id === answer.id}
            value={answer.value} />
          <label />
        </div>
        <span className={labelStyles} onClick={() => (this.onChange(answer.value, answer.id))}>
          {answer.displayValue}
        </span>
      </div>
    );
  }

  renderMultiSelectItem(multiSelectAnswer: FullAnswerFragment, index: number) {
    const { editable, answerData } = this.props;
    const answers = (answerData || {}).answers || [];
    const selected = !!answers.find(answer => answer.id === multiSelectAnswer.id);

    return (
      <RiskAreaMultiSelectAnswer
        key={`${multiSelectAnswer.id}-${index}`}
        answer={multiSelectAnswer}
        onClick={this.onClickMultiSelect}
        selected={selected}
        editable={editable} />
    );
  }

  renderAnswers() {
    const { question, editable, answerData } = this.props;
    const answers = question.answers || [];

    const selectStyles = classNames(formStyles.select, styles.select);
    const questionBodyStyles = classNames(styles.riskAssessmentQuestionBody, {
      [styles.noBottomPadding]:
        question.answerType === 'radio' || question.answerType === 'multiselect',
    });

    const defaultAnswerData = { answers: [], oldAnswers: [], changed: true };
    const currentAnswer = (answerData || defaultAnswerData).answers[0];

    switch (question.answerType) {
      case 'dropdown':
        return (
          <div className={questionBodyStyles}>
            <select
              disabled={!editable}
              value={currentAnswer ? currentAnswer.value : ''}
              onChange={event => this.onDropdownChange(event.currentTarget.value)}
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
        // This is a weird answer type. Return nothing if there are no answers associated with it.
        const answer = answers[0];

        if (answers) {
          const answerId = answer.id;

          return (
            <div className={questionBodyStyles}>
              <div className={styles.textArea}>
                <textarea
                  value={currentAnswer ? currentAnswer.value : ''}
                  onChange={event => this.onChange(event.target.value, answerId)}
                  disabled={!editable}
                  className={formStyles.textarea} />
              </div>
            </div>
          );
        }
      case 'multiselect':
        return (
          <div className={questionBodyStyles}>
            <div className={styles.multiSelectRow}>
              {answers.map(this.renderMultiSelectItem)}
            </div>
          </div>
        );
      default:
        return <div>Invalid answer type</div>;
    }
  }

  render() {
    const { question, editable } = this.props;

    const questionStyles = classNames(styles.riskAssessmentQuestion, {
      [styles.disabled]: !editable,
    });

    return (
      <div className={questionStyles}>
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
