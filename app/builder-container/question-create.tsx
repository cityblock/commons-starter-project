import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as questionCreateMutationGraphql from '../graphql/queries/question-create-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  questionCreateMutation,
  questionCreateMutationVariables,
  AnswerTypeOptions,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as questionStyles from '../shared/css/two-panel-right.css';
import { IUpdatedField } from '../shared/util/updated-fields';
import * as styles from './css/risk-area-create.css';

export interface IOptions {
  variables: questionCreateMutationVariables;
}

interface IProps {
  riskAreaId?: string;
  screeningToolId?: string;
  progressNoteTemplateId?: string;
  routeBase: string;
  onClose: () => any;
  redirectToQuestion?: (questionId: string) => any;
}

interface IGraphqlProps {
  createQuestion?: (options: IOptions) => { data: questionCreateMutation };
}

interface IState {
  loading: boolean;
  error?: string;
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
      question: {
        title: '',
        order: 1,
        answerType: 'dropdown' as AnswerTypeOptions,
        riskAreaId: props.riskAreaId,
        screeningToolId: props.screeningToolId,
        progressNoteTemplateId: props.progressNoteTemplateId,
        applicableIfType: undefined,
      },
    };
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const { question } = this.state;
    const { fieldName, fieldValue } = updatedField;

    (question as any)[fieldName] = fieldValue;

    this.setState(() => ({ question }));
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState(() => ({ [fieldName]: fieldValue }));

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (this.props.createQuestion) {
      try {
        this.setState({ loading: true });
        const question = await this.props.createQuestion({
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

  render() {
    const { loading, question } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

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
            </div>
          </div>
          <div className={styles.flexInputGroup}>
            <select
              name="applicableIfType"
              value={question.applicableIfType || 'Select one'}
              onChange={this.onChange}
              className={classNames(formStyles.select, formStyles.inputSmall, styles.flexInputItem)}
            >
              <option value={'Select one'} disabled={true}>
                Select one (Required!)
              </option>
              <option value="oneTrue">one true</option>
              <option value="allTrue">all true</option>
            </select>
            <select
              required
              name="answerType"
              value={question.answerType || 'Select one'}
              onChange={this.onChange}
              className={classNames(formStyles.select, formStyles.inputSmall, styles.flexInputItem)}
            >
              <option value={'Select one'} disabled={true}>
                Select one (Required!)
              </option>
              <option value="dropdown">dropdown</option>
              <option value="radio">radio</option>
              <option value="freetext">freetext</option>
              <option value="multiselect">multiselect</option>
            </select>
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
  connect(undefined, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(questionCreateMutationGraphql as any, {
    name: 'createQuestion',
    options: {
      refetchQueries: ['getQuestions'],
    },
  }),
)(QuestionCreate);
