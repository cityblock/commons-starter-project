import * as classNames from 'classnames';
import { clone, isNil, omit, omitBy, range } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as answerCreateMutation from '../graphql/queries/answer-create-mutation.graphql';
import * as answerDeleteMutation from '../graphql/queries/answer-delete-mutation.graphql';
import * as answerEditMutation from '../graphql/queries/answer-edit-mutation.graphql';
import {
  answerCreateMutationVariables,
  answerDeleteMutationVariables,
  answerEditMutationVariables,
  FullAnswerFragment,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as answerStyles from '../shared/css/two-panel-right.css';
import { IUpdatedField } from '../shared/patient-demographics-form';
import CarePlanSuggestions from './care-plan-suggestions';
import * as styles from './css/risk-area-create.css';

export interface ICreateOptions { variables: answerCreateMutationVariables; }
export interface IEditOptions { variables: answerEditMutationVariables; }
export interface IDeleteOptions { variables: answerDeleteMutationVariables; }

export interface IProps {
  answer?: FullAnswerFragment;
  questionId: string;
  createAnswer: (options: ICreateOptions) => { data: { answerCreate: FullAnswerFragment } };
  editAnswer: (options: IEditOptions) => { data: { answerEdit: FullAnswerFragment } };
  deleteAnswer: (options: IDeleteOptions) => { data: { answerDelete: FullAnswerFragment } };
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
    this.onDeleteClick = this.onDeleteClick.bind(this);

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

  componentWillReceiveProps(nextProps: IProps) {
    const { questionId } = nextProps;

    if (questionId !== this.props.questionId) {
      const { answer } = this.state;
      answer.questionId = questionId;
      this.setState({ answer });
    }
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const answer = clone(this.state.answer);
    const { fieldName, fieldValue } = updatedField;

    (answer as any)[fieldName] = fieldValue;

    this.setState({ answer });
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const fieldName = event.target.name;
    let fieldValue: any = event.target.value;

    if (fieldValue === 'true') {
      fieldValue = true;
    } else if (fieldValue === 'false') {
      fieldValue = false;
    }

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      this.setState({ loading: true });
      const filtered = omitBy<answerCreateMutationVariables, {}>(this.state.answer, isNil);

      if (this.props.answer) {
        await this.props.editAnswer({
          variables: {
            answerId: this.props.answer.id,
            ...omit(filtered, ['questionId']),
          },
        });
      } else {
        await this.props.createAnswer({
          variables: filtered,
        });
      }
      this.setState({ loading: false });
    } catch (e) {
      this.setState({ error: e.message, loading: false });
    }
    return false;
  }

  async onDeleteClick() {
    if (this.props.answer) {
      await this.props.deleteAnswer({
        variables: {
          answerId: this.props.answer.id,
        },
      });
    }
  }

  render() {
    const { loading, answer } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;
    const createEditText = this.props.answer ? 'Save' : 'Add answer';
    const deleteHtml = this.props.answer ? (<div onClick={this.onDeleteClick}>delete</div>) : null;
    const answerId = this.props.answer ?
      (<div className={answerStyles.smallText}>Answer ID: {this.props.answer.id}</div>) :
      (<div className={answerStyles.smallText}>New Answer!</div>);
    const orders = range(1, 30).map(num => (
      <option key={`${num}-select`} value={num}>{num}</option>
    ));
    const carePlanSuggestionsHtml = this.props.answer ?
      (<CarePlanSuggestions answer={this.props.answer} />) : null;
    return (
      <form onSubmit={this.onSubmit} className={answerStyles.borderContainer}>
        <div className={loadingClass}>
          <div className={styles.loadingContainer}>
            <div className={loadingStyles.loadingSpinner}></div>
          </div>
        </div>
        <div className={styles.inputGroup}>
          {answerId}
          <br />
          <div className={styles.inlineInputGroup}>
            <div className={answerStyles.smallText}>Order:</div>
            <select
              name='order'
              value={answer.order || 1}
              onChange={this.onChange}
              className={
                classNames(formStyles.select, formStyles.inputSmall)}>
              <option value='' disabled hidden>Select Answer order</option>
              {orders}
            </select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={answerStyles.smallText}>Display Value:</div>
            <input
              name='displayValue'
              value={answer.displayValue}
              placeholder={'Enter answer display value'}
              className={classNames(formStyles.input, formStyles.inputSmall)}
              onChange={this.onChange} />
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={answerStyles.smallText}>Backend Value:</div>
            <input
              name='value'
              value={answer.value}
              placeholder={'Enter answer value'}
              className={classNames(formStyles.input, formStyles.inputSmall)}
              onChange={this.onChange} />
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={answerStyles.smallText}>Backend value type:</div>
            <select
              name='valueType'
              value={answer.valueType || ''}
              onChange={this.onChange}
              className={
                classNames(formStyles.select, formStyles.inputSmall)}>
              <option value='' disabled hidden>Select Answer value type</option>
              <option value='string'>text</option>
              <option value='boolean'>true / false</option>
              <option value='number'>number</option>
            </select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={answerStyles.smallText}>Risk adjustment type:</div>
            <select required
              name='riskAdjustmentType'
              value={answer.riskAdjustmentType || ''}
              onChange={this.onChange}
              className={
                classNames(formStyles.select, formStyles.inputSmall)}>
              <option value='' disabled hidden>Select risk adjustment type</option>
              <option value='inactive'>inactive</option>
              <option value='increment'>increment</option>
              <option value='forceHighRisk'>forceHighRisk</option>
            </select>
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={answerStyles.smallText}>Summary Text:</div>
            <input
              name='summaryText'
              placeholder={'Enter summary text'}
              value={answer.summaryText || ''}
              className={classNames(formStyles.input, formStyles.inputSmall)}
              onChange={this.onChange} />
          </div>
          <div className={formStyles.radioGroup}>
            <div className={formStyles.radioGroupLabel}>
              <div className={answerStyles.smallText}>Display in summary?</div>
            </div>
            <div className={classNames(formStyles.radioGroupOptions, styles.radioGroup)}>
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
                <span className={formStyles.radioLabel}>Yes</span>
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
                <span className={formStyles.radioLabel}>No</span>
              </div>
            </div>
          </div>
        </div>
        {carePlanSuggestionsHtml}
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <input
              type='submit'
              className={styles.submitButton}
              value={createEditText} />
            {deleteHtml}
          </div>
        </div>
      </form>
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
  graphql(answerDeleteMutation as any, {
    name: 'deleteAnswer',
    options: {
      refetchQueries: [
        'getQuestionsForRiskArea',
      ],
    },
  }),
)(AnswerCreateEdit as any) as any;
