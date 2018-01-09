import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as questionCreateMutationGraphql from '../graphql/queries/question-create-mutation.graphql';
import {
  questionCreateMutation,
  questionCreateMutationVariables,
  AnswerTypeOptions,
  AssessmentType,
  FullComputedFieldFragment,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as questionStyles from '../shared/css/two-panel-right.css';
import * as builderStyles from '../shared/css/two-panel-right.css';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import { IUpdatedField } from '../shared/util/updated-fields';
import * as styles from './css/risk-area-create.css';

const NOT_COMPUTED_FIELD_ID = 'not-computed-field';

export interface IOptions {
  variables: questionCreateMutationVariables;
}

interface IProps {
  riskAreaId: string | null;
  assessmentType: AssessmentType | null;
  screeningToolId: string | null;
  progressNoteTemplateId: string | null;
  routeBase: string;
  onClose: () => any;
  redirectToQuestion?: (questionId: string) => any;
  computedFields?: FullComputedFieldFragment[];
}

interface IGraphqlProps {
  createQuestion?: (options: IOptions) => { data: questionCreateMutation };
}

interface IState {
  loading: boolean;
  error: string | null;
  question: questionCreateMutationVariables;
}

type allProps = IProps & IGraphqlProps;

class QuestionCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      loading: false,
      error: null,
      question: {
        title: '',
        order: 1,
        answerType: 'dropdown' as AnswerTypeOptions,
        riskAreaId: props.riskAreaId,
        screeningToolId: props.screeningToolId,
        progressNoteTemplateId: props.progressNoteTemplateId,
        applicableIfType: null,
        computedFieldId: null,
        hasOtherTextAnswer: null,
      },
    };
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const { question } = this.state;
    const { fieldName, fieldValue } = updatedField;

    if (fieldName === 'computedFieldId') {
      if (fieldValue === NOT_COMPUTED_FIELD_ID) {
        question.computedFieldId = null;
        question.answerType = 'dropdown' as AnswerTypeOptions;
      } else {
        question.computedFieldId = fieldValue;
        question.answerType = 'radio' as AnswerTypeOptions;
      }
    } else {
      if (fieldName === 'answerType' && fieldValue !== 'dropdown') {
        question.hasOtherTextAnswer = null;
      }
      (question as any)[fieldName] = fieldValue;
    }

    this.setState({ question });
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

    const { createQuestion, assessmentType } = this.props;
    if (createQuestion) {
      // don't allow submitting automated assessment without computed field
      if (assessmentType === 'automated' && !this.state.question.computedFieldId) return;

      try {
        this.setState({ loading: true });
        const question = await createQuestion({
          variables: {
            ...this.state.question,
          },
        });
        this.setState({ loading: false });
        this.props.onClose();
        if (this.props.redirectToQuestion && question.data.questionCreate) {
          this.props.redirectToQuestion(question.data.questionCreate.id);
        }
      } catch (e) {
        this.setState({ error: e.message, loading: false });
      }
    }
    return false;
  }

  renderAnswerType() {
    const { question } = this.state;
    const { computedFieldId } = question;

    if (!!computedFieldId && computedFieldId !== NOT_COMPUTED_FIELD_ID) {
      return (
        <div>
          <div className={builderStyles.smallText}>Answer Type:</div>
          <div className={builderStyles.largeText}>{question.answerType}</div>
        </div>
      );
    } else {
      return (
        <Select
          required
          name="answerType"
          value={question.answerType || ''}
          onChange={this.onChange}
        >
          <Option value="" disabled={true} messageId="question.selectAnswerType" />
          <Option value="dropdown" messageId="question.answerTypeDropdown" />
          <Option value="radio" messageId="question.answerTypeRadio" />
          <Option value="freetext" messageId="question.answerTypeFreeText" />
          <Option value="multiselect" messageId="question.answerTypeMultiselect" />
        </Select>
      );
    }
  }

  renderOtherTextAnswerOption() {
    const { question } = this.state;
    const { computedFieldId, screeningToolId, answerType } = question;

    if (!computedFieldId && !screeningToolId && answerType === 'dropdown') {
      let selectValue = '';

      if (question.hasOtherTextAnswer === true) {
        selectValue = 'true';
      } else if (question.hasOtherTextAnswer === false) {
        selectValue = 'false';
      }

      return (
        <Select
          name="hasOtherTextAnswer"
          value={selectValue}
          onChange={this.onChange}
        >
          <Option value="" disabled={true} messageId="question.selectHasOtherTextAnswer" />
          <Option value="true" messageId="question.hasOtherTextAnswerTrue" />
          <Option value="false" messageId="question.hasOtherTextAnswerFalse" />
        </Select>
      );
    }
  }

  render() {
    const { loading, question } = this.state;
    const { computedFields, assessmentType } = this.props;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;
    const computedFieldOptions = (computedFields || []).map(computedField => (
      <Option key={computedField.id} value={computedField.id} label={computedField.label} />
    ));

    return (
      <div className={questionStyles.container}>
        <form onSubmit={this.onSubmit}>
          <div className={styles.formTop}>
            <div className={styles.close} onClick={this.props.onClose} />
          </div>
          <div className={styles.formCenter}>
            <div className={loadingClass}>
              <div className={styles.loadingContainer}>
                <div className={loadingStyles.loadingSpinner} />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <input
                name="title"
                value={question.title}
                placeholder={'Enter question title'}
                className={formStyles.input}
                onChange={this.onChange}
              />
              <input
                type="number"
                name="order"
                placeholder={'Enter question order'}
                value={question.order}
                className={formStyles.input}
                onChange={this.onChange}
              />
              {assessmentType === 'automated' && (
                <Select
                  name="computedFieldId"
                  value={question.computedFieldId || ''}
                  onChange={this.onChange}
                >
                  <Option value="" disabled={true} messageId="question.selectComputedField" />
                  {computedFieldOptions}
                </Select>
              )}
              <Select
                required
                name="applicableIfType"
                value={question.applicableIfType || ''}
                onChange={this.onChange}
              >
                <Option value="" disabled={true} messageId="question.selectApplicable" />
                <Option value="oneTrue" messageId="question.applicableOneTrue" />
                <Option value="allTrue" messageId="question.applicableAllTrue" />
              </Select>
              {this.renderAnswerType()}
              {this.renderOtherTextAnswerOption()}
            </div>
          </div>
          <div className={styles.formBottom}>
            <div className={styles.formBottomContent}>
              <div className={styles.cancelButton} onClick={this.props.onClose}>
                Cancel
              </div>
              <input type="submit" className={styles.submitButton} value="Add question" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: allProps): Partial<allProps> {
  return {
    redirectToQuestion: (questionId: string) => {
      dispatch(push(`${ownProps.routeBase}/${questionId}`));
    },
  };
}

export default compose(
  connect(null, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(questionCreateMutationGraphql as any, {
    name: 'createQuestion',
    options: {
      refetchQueries: ['getQuestions', 'getComputedFields'],
    },
  }),
)(QuestionCreate);
