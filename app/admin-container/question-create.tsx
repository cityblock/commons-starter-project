import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as questionCreateMutation from '../graphql/queries/question-create-mutation.graphql';
import {
  questionCreateMutationVariables,
  FullQuestionFragment,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import { IUpdatedField } from '../shared/patient-demographics-form';
import * as styles from './css/risk-area-create.css';
import * as questionStyles from './css/two-panel-right.css';

export interface IOptions { variables: questionCreateMutationVariables; }

export interface IProps {
  riskAreaId: string;
  routeBase: string;
  onClose: () => any;
  createQuestion: (options: IOptions) => { data: { questionCreate: FullQuestionFragment } };
  redirectToQuestion: (questionId: string) => any;
}

export interface IState {
  loading: boolean;
  error?: string;
  question: questionCreateMutationVariables;
}

class QuestionCreate extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      loading: false,
      question: {
        title: '',
        order: 1,
        answerType: 'dropdown',
        riskAreaId: props.riskAreaId,
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
    try {
      this.setState({ loading: true });
      const question = await this.props.createQuestion({
        variables: {
          ...this.state.question,
        },
      });
      this.setState({ loading: false });
      this.props.onClose();
      this.props.redirectToQuestion(question.data.questionCreate.id);
    } catch (e) {
      this.setState({ error: e.message, loading: false });
    }
    return false;
  }

  render() {
    const { loading, question } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    return (
      <div className={questionStyles.container}>
        <form onSubmit={this.onSubmit} className={styles.container}>
          <div className={styles.formTop}>
            <div className={styles.close} onClick={this.props.onClose} />
          </div>
          <div className={styles.formCenter}>
            <div className={loadingClass}>
              <div className={styles.loadingContainer}>
                <div className={loadingStyles.loadingSpinner}></div>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <input
                name='title'
                value={question.title}
                placeholder={'Enter domain title'}
                className={formStyles.input}
                onChange={this.onChange} />
              <input
                type='number'
                name='order'
                placeholder={'Enter domain order'}
                value={question.order}
                className={formStyles.input}
                onChange={this.onChange} />
            </div>
          </div>
          <div className={styles.flexInputGroup}>
            <select
              name='applicableIfType'
              value={question.applicableIfType || ''}
              onChange={this.onChange}
              className={
                classNames(formStyles.select, formStyles.inputSmall, styles.flexInputItem)}>
              <option value='allTrue'>all true</option>
              <option value='oneTrue'>one true</option>
            </select>
            <select required
              name='answerType'
              value={question.answerType}
              onChange={this.onChange}
              className={
                classNames(formStyles.select, formStyles.inputSmall, styles.flexInputItem)}>
              <option value='dropdown'>dropdown</option>
              <option value='radio'>radio</option>
              <option value='freetext'>freetext</option>
              <option value='multiselect'>multiselect</option>
            </select>
          </div>
          <div className={styles.formBottom}>
            <div className={styles.formBottomContent}>
              <div className={styles.cancelButton} onClick={this.props.onClose}>Cancel</div>
              <input
                type='submit'
                className={styles.submitButton}
                value='Add question' />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): Partial<IProps> {
  return {
    redirectToQuestion: (questionId: string) => {
      dispatch(push(`${ownProps.routeBase}/${questionId}`));
    },
  };
}

export default compose(
  connect(undefined, mapDispatchToProps),
  graphql(questionCreateMutation as any, {
    name: 'createQuestion',
    options: {
      refetchQueries: [
        'getQuestionsForRiskArea',
      ],
    },
  }),
)(QuestionCreate as any) as any;
