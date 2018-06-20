import { clone, isNil, omit, omitBy, range } from 'lodash';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import answerCreateGraphql from '../graphql/queries/answer-create-mutation.graphql';
import answerDeleteGraphql from '../graphql/queries/answer-delete-mutation.graphql';
import answerEditGraphql from '../graphql/queries/answer-edit-mutation.graphql';
import {
  answerCreate,
  answerCreateVariables,
  answerDelete,
  answerDeleteVariables,
  answerEdit,
  answerEditVariables,
  AnswerValueTypeOptions,
  ComputedFieldDataTypes,
  FullAnswer,
} from '../graphql/types';
import loadingStyles from '../shared/css/loading-spinner.css';
import answerStyles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import FormLabel from '../shared/library/form-label/form-label';
import Option from '../shared/library/option/option';
import RadioGroup from '../shared/library/radio-group/radio-group';
import RadioInput from '../shared/library/radio-input/radio-input';
import Select from '../shared/library/select/select';
import TextInput from '../shared/library/text-input/text-input';
import { IUpdatedField } from '../shared/util/updated-fields';
import CarePlanSuggestions from './care-plan-suggestions';
import styles from './css/risk-area-create.css';

interface ICreateOptions {
  variables: answerCreateVariables;
}
interface IEditOptions {
  variables: answerEditVariables;
}
interface IDeleteOptions {
  variables: answerDeleteVariables;
}

interface IProps {
  answer?: FullAnswer;
  questionId: string;
  screeningToolAnswer?: boolean;
  dataType?: ComputedFieldDataTypes;
}

interface IGraphqlProps {
  createAnswer: (
    options: ICreateOptions,
  ) => { data: answerCreate; errors: Array<{ message: string }> };
  editAnswer: (options: IEditOptions) => { data: answerEdit; errors: Array<{ message: string }> };
  deleteAnswer: (options: IDeleteOptions) => { data: { answerDelete: answerDelete } };
}

interface IState {
  loading: boolean;
  error: string | null;
  answer: answerCreateVariables;
}

type allProps = IProps & IGraphqlProps;

export function getMessageIdForOption(value?: string) {
  if (value === 'string') {
    return 'builder.string';
  } else if (value === 'boolean') {
    return 'builder.boolean';
  }
  return undefined;
}

class AnswerCreateEdit extends React.Component<allProps, IState> {
  static getDerivedStateFromProps(nextProps: allProps, prevState: IState) {
    const { questionId } = nextProps;

    if (nextProps.questionId !== prevState.answer.questionId) {
      const { answer } = prevState;
      answer.questionId = questionId;
      return { ...prevState, answer };
    }
    return prevState;
  }

  constructor(props: allProps) {
    super(props);

    const { screeningToolAnswer } = props;

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.getValueTypeOptions = this.getValueTypeOptions.bind(this);

    this.state = {
      loading: false,
      error: null,
      answer: props.answer
        ? props.answer
        : {
            displayValue: 'edit me!',
            value: screeningToolAnswer ? '0' : 'true',
            valueType: this.getInitialValueType() as AnswerValueTypeOptions,
            riskAdjustmentType: null,
            inSummary: false,
            summaryText: null,
            questionId: props.questionId,
            order: 1,
          },
    };
  }

  getInitialValueType() {
    const { screeningToolAnswer, dataType } = this.props;

    if (screeningToolAnswer) {
      return 'number';
    } else if (dataType) {
      return dataType;
    } else {
      return 'boolean';
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

  async onSubmit() {
    try {
      // TODO: remove as any and use regular type checking
      this.setState({ loading: true, error: null });
      const filtered = omitBy<answerCreateVariables>(this.state.answer, isNil);
      let result: {
        data: answerCreate | answerEdit;
        errors?: Array<{ message: string }>;
      } | null = null;
      if (this.props.answer) {
        result = await this.props.editAnswer({
          variables: {
            answerId: this.props.answer.id,
            ...omit<any>(filtered, ['questionId']),
          },
        });
      } else {
        result = await this.props.createAnswer({
          variables: filtered as any,
        });
      }
      if (result && result.errors) {
        this.setState({ loading: false, error: result.errors[0].message });
      } else {
        this.setState({ loading: false });
      }
    } catch (err) {
      this.setState({ error: err.message, loading: false });
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

  getValueTypeOptions() {
    const { screeningToolAnswer, dataType } = this.props;
    const { answer } = this.state;
    if (screeningToolAnswer) {
      return <Option value="number" />;
    } else if (dataType) {
      return <Option value={dataType} messageId={getMessageIdForOption(dataType)} />;
    } else if (this.props.answer) {
      return (
        <Option value={answer.valueType} messageId={getMessageIdForOption(answer.valueType)} />
      );
    } else {
      return [
        <Option
          key={'default-option'}
          value=""
          disabled
          messageId="builder.selectAnswerValueType"
        />,
        <Option key={'string-option'} value="string" messageId={getMessageIdForOption('string')} />,
        <Option
          key={'boolean-option'}
          value="boolean"
          messageId={getMessageIdForOption('boolean')}
        />,
        <Option key={'number-option'} value="number" />,
      ];
    }
  }

  render() {
    const { loading, answer, error } = this.state;
    const { screeningToolAnswer } = this.props;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;
    const createEditText = this.props.answer ? 'Save' : 'Add answer';
    const deleteHtml = this.props.answer ? <div onClick={this.onDeleteClick}>delete</div> : null;
    const answerId = this.props.answer ? (
      <div className={answerStyles.smallText}>Answer ID: {this.props.answer.id}</div>
    ) : (
      <div className={answerStyles.smallText}>New Answer!</div>
    );
    const orders = range(1, 30).map(num => <Option key={`${num}-select`} value={num.toString()} />);
    const carePlanSuggestionsHtml = this.props.answer ? (
      <CarePlanSuggestions answer={this.props.answer} />
    ) : null;
    const valueType = screeningToolAnswer ? 'number' : answer.valueType || '';
    const backendValueHtml = this.props.answer ? (
      <div className={answerStyles.largeText}>{answer.value}</div>
    ) : (
      <TextInput
        name="value"
        value={answer.value}
        placeholderMessageId="builder.enterAnswerValue"
        onChange={this.onChange}
      />
    );
    return (
      <div className={answerStyles.borderContainer}>
        <div className={styles.error}>{error}</div>
        <div className={loadingClass}>
          <div className={styles.loadingContainer}>
            <div className={loadingStyles.loadingSpinner} />
          </div>
        </div>
        <div className={styles.inputGroup}>
          {answerId}
          <br />
          <div className={styles.inlineInputGroup}>
            <FormLabel messageId="builder.order" />
            <Select name="order" value={answer.order.toString() || '1'} onChange={this.onChange}>
              <Option value="" disabled label="Select Answer order" />
              {orders}
            </Select>
          </div>
          <div className={styles.inlineInputGroup}>
            <FormLabel messageId="builder.displayValue" />
            <TextInput
              name="displayValue"
              value={answer.displayValue}
              placeholderMessageId="builder.enterDisplayValue"
              onChange={this.onChange}
            />
          </div>
          <div className={styles.inlineInputGroup}>
            <FormLabel messageId="builder.backendValue" />
            {backendValueHtml}
          </div>
          <div className={styles.inlineInputGroup}>
            <FormLabel messageId="builder.backendValueType" />
            <Select name="valueType" value={valueType} onChange={this.onChange}>
              {this.getValueTypeOptions()}
            </Select>
          </div>
          <div className={styles.inlineInputGroup}>
            <FormLabel messageId="builder.riskAdjustmentType" />
            <Select
              required
              name="riskAdjustmentType"
              value={answer.riskAdjustmentType || ''}
              onChange={this.onChange}
            >
              <Option
                value=""
                disabled={true}
                messageId="riskAdjustmentType.selectRiskAdjustmentType"
              />
              <Option value="inactive" messageId="riskAdjustmentType.inactive" />
              <Option value="increment" messageId="riskAdjustmentType.increment" />
              <Option value="forceHighRisk" messageId="riskAdjustmentType.forceHighRisk" />
            </Select>
          </div>
          <div className={styles.inlineInputGroup}>
            <FormLabel messageId="builder.summaryText" />
            <TextInput
              name="summaryText"
              placeholderMessageId="builder.enterSummary"
              value={answer.summaryText || ''}
              onChange={this.onChange}
            />
          </div>
          <div className={styles.inlineInputGroup}>
            <FormLabel messageId="builder.displayInSummary" />
            <RadioGroup>
              <RadioInput
                name="inSummary"
                onChange={this.onChange}
                checked={answer.inSummary ? answer.inSummary === true : false}
                value="true"
                label="Yes"
              />
              <RadioInput
                name="inSummary"
                onChange={this.onChange}
                checked={answer.inSummary ? false : true}
                value="false"
                label="No"
              />
            </RadioGroup>
          </div>
        </div>
        {carePlanSuggestionsHtml}
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <Button onClick={this.onSubmit} label={createEditText} />
            {deleteHtml}
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(answerCreateGraphql, {
    name: 'createAnswer',
    options: {
      refetchQueries: ['getQuestions'],
    },
  }),
  graphql(answerEditGraphql, {
    name: 'editAnswer',
  }),
  graphql(answerDeleteGraphql, {
    name: 'deleteAnswer',
    options: {
      refetchQueries: ['getQuestions'],
    },
  }),
)(AnswerCreateEdit) as React.ComponentClass<IProps>;
