import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as answerCreateMutation from '../graphql/queries/answer-create-mutation.graphql';
import * as answerEditMutation from '../graphql/queries/answer-edit-mutation.graphql';
import {
  answerCreateMutationVariables,
  answerEditMutationVariables,
  FullAnswerFragment,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import { IUpdatedField } from '../shared/patient-demographics-form';
import * as styles from './css/risk-area-create.css';
import * as answerStyles from './css/two-panel-right.css';

export interface ICreateOptions { variables: answerCreateMutationVariables; }
export interface IEditOptions { variables: answerEditMutationVariables; }

export interface IProps {
  answer?: FullAnswerFragment;
  questionId: string;
  createAnswer: (options: ICreateOptions) => { data: { answerCreate: FullAnswerFragment } };
  editAnswer: (options: IEditOptions) => { data: { answerEdit: FullAnswerFragment } };
}

export interface IState {
  loading: boolean;
  error?: string;
  answer: answerCreateMutationVariables;
}

class AnswerCreateEdit extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      loading: false,
      answer: props.answer ? props.answer : {
        displayValue: 'edit me!',
        value: 'true',
        valueType: 'boolean',
        riskAdjustmentType: null,
        inSummary: false,
        summaryText: null,
        questionId: props.questionId,
        order: 1,
      },
    };
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const { answer } = this.state;
    const { fieldName, fieldValue } = updatedField;

    (answer as any)[fieldName] = fieldValue;

    this.setState(() => ({ answer }));
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const fieldName = event.target.name;
    let fieldValue: any = event.target.value;

    if (fieldValue === 'true') {
      fieldValue = true;
    } else if (fieldValue === 'false') {
      fieldValue = false;
    }

    this.setState(() => ({ [fieldName]: fieldValue }));

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      this.setState({ loading: true });
      if (this.props.answer) {
        await this.props.editAnswer({
          variables: {
            answerId: this.props.answer.id,
            ...this.state.answer,
          },
        });
      } else {
        await this.props.createAnswer({
          variables: {
            ...this.state.answer,
          },
        });
      }
      this.setState({ loading: false });
    } catch (e) {
      this.setState({ error: e.message, loading: false });
    }
    return false;
  }

  render() {
    const { loading, answer } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;
    const createEditText = this.props.answer ? 'Save' : 'Add answer';
    return (
      <div className={answerStyles.container}>
        <form onSubmit={this.onSubmit} className={styles.container}>
          <div className={styles.formCenter}>
            <div className={loadingClass}>
              <div className={styles.loadingContainer}>
                <div className={loadingStyles.loadingSpinner}></div>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <input
                name='displayValue'
                value={answer.displayValue}
                placeholder={'Enter answer display value'}
                className={formStyles.input}
                onChange={this.onChange} />
              <input
                name='value'
                value={answer.value}
                placeholder={'Enter answer value'}
                className={formStyles.input}
                onChange={this.onChange} />
              <input
                type='number'
                name='order'
                placeholder={'Enter answer order'}
                value={answer.order}
                className={formStyles.input}
                onChange={this.onChange} />
              <input
                name='summaryText'
                placeholder={'Enter summary text'}
                value={answer.summaryText || ''}
                className={formStyles.input}
                onChange={this.onChange} />
            </div>
          </div>
          <div className={formStyles.radioInputFormRow}>
            <div className={formStyles.radioGroup}>
              <div className={formStyles.radioGroupLabel}>
                <div className={formStyles.inputLabel}>in summary?</div>
              </div>
              <div className={formStyles.radioGroupOptions}>
                <div className={formStyles.radioGroupItem}>
                  <div className={formStyles.radioGroupContainer}>
                    <input
                      className={formStyles.radio}
                      type='radio'
                      name='inSummary'
                      onChange={this.onChange}
                      checked={answer.inSummary ? answer.inSummary === true : false}
                      value='true' />
                    <label />
                  </div>
                  <span className={formStyles.radioLabel}>In summary</span>
                </div>
                <div className={formStyles.radioGroupItem}>
                  <div className={formStyles.radioGroupContainer}>
                    <input
                      className={formStyles.radio}
                      type='radio'
                      name='inSummary'
                      onChange={this.onChange}
                      checked={answer.inSummary ? false : true}
                      value='false' />
                    <label />
                  </div>
                  <span className={formStyles.radioLabel}>not in summary</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.flexInputGroup}>
            <select
              name='valueType'
              value={answer.valueType || ''}
              onChange={this.onChange}
              className={
                classNames(formStyles.select, formStyles.inputSmall, styles.flexInputItem)}>
              <option value='string'>text</option>
              <option value='boolean'>true / false</option>
              <option value='number'>number</option>
            </select>
            <select required
              name='riskAdjustmentType'
              value={answer.riskAdjustmentType || ''}
              onChange={this.onChange}
              className={
                classNames(formStyles.select, formStyles.inputSmall, styles.flexInputItem)}>
              <option value='increment'>increment</option>
              <option value='forceHighRisk'>forceHighRisk</option>
            </select>
          </div>
          <div className={styles.formBottom}>
            <div className={styles.formBottomContent}>
              <input
                type='submit'
                className={styles.submitButton}
                value={createEditText} />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default compose(
  graphql(answerCreateMutation as any, {
    name: 'createAnswer',
    options: {
      refetchQueries: [
        'getQuestionsForRiskArea',
      ],
    },
  }),
  graphql(answerEditMutation as any, {
    name: 'editAnswer',
  }),
)(AnswerCreateEdit as any) as any;
