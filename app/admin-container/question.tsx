import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as questionQuery from '../graphql/queries/get-question.graphql';
import * as questionEditMutation from '../graphql/queries/question-edit-mutation.graphql';
import {
  questionEditMutationVariables,
  FullQuestionFragment,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import { IState as IAppState } from '../store';
import AnswerCreateEdit from './answer-create-edit';
import * as styles from './css/two-panel-right.css';
import QuestionConditions from './question-conditions';

export interface IProps {
  questions: FullQuestionFragment[];
  question?: FullQuestionFragment;
  routeBase: string;
  questionId?: string;
  questionLoading?: boolean;
  questionError?: string;
  refetchQuestion: () => any;
  match?: {
    params: {
      questionId?: string;
    };
  };
  editQuestion: (
    options: { variables: questionEditMutationVariables },
  ) => { data: { questionComplete: FullQuestionFragment } };
  onDelete: (questionId: string) => any;
}

export interface IState {
  deleteConfirmationInProgress: boolean;
  deleteError?: string;
  editedTitle: string;
  editingTitle: boolean;
  editTitleError?: string;
  editedOrder: number;
  editOrderError?: string;
  editingOrder: boolean;
}

class Question extends React.Component<IProps, IState> {
  editTitleInput: HTMLInputElement | null;
  editOrderInput: HTMLInputElement | null;
  titleBody: HTMLDivElement | null;
  orderBody: HTMLDivElement | null;

  constructor(props: IProps) {
    super(props);

    this.reloadQuestion = this.reloadQuestion.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onCancelDelete = this.onCancelDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClickToEditTitle = this.onClickToEditTitle.bind(this);
    this.onClickToEditOrder = this.onClickToEditOrder.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);

    this.editTitleInput = null;
    this.editOrderInput = null;
    this.titleBody = null;
    this.orderBody = null;

    this.state = {
      deleteConfirmationInProgress: false,
      deleteError: undefined,
      editedTitle: '',
      editingTitle: false,
      editedOrder: 1,
      editingOrder: false,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { question } = nextProps;

    if (question) {
      if (!this.props.question) {
        this.setState(() => ({
          editedTitle: question.title,
          editedOrder: question.order,
        }));
      } else if (this.props.question.id !== question.id) {
        this.setState(() => ({
          editedTitle: question.title,
          editedOrder: question.order,
        }));
      }
    }
  }

  reloadQuestion() {
    const { refetchQuestion } = this.props;

    if (refetchQuestion) {
      refetchQuestion();
    }
  }

  onClickDelete() {
    const { questionId } = this.props;

    if (questionId) {
      this.setState(() => ({ deleteConfirmationInProgress: true }));
    }
  }

  async onConfirmDelete() {
    const { onDelete, questionId } = this.props;

    if (questionId) {
      try {
        this.setState(() => ({ deleteError: undefined }));
        await onDelete(questionId);
        this.setState(() => ({ deleteConfirmationInProgress: false }));
      } catch (err) {
        this.setState(() => ({ deleteError: err.message }));
      }
    }
  }

  onCancelDelete() {
    this.setState(() => ({ deleteError: undefined, deleteConfirmationInProgress: false }));
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    this.setState(() => ({ [name]: value || '' }));
  }

  async onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { questionId, editQuestion } = this.props;

    // edit if no question id
    if (!questionId) {
      return;
    }

    const value = event.currentTarget.value;
    const name = event.currentTarget.name;
    const variables = { questionId, [name]: value };

    this.setState(() => ({ [name]: value || '' }));

    await editQuestion({ variables });
  }

  async onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { questionId, editQuestion } = this.props;
    const { editedTitle, editedOrder } = this.state;
    const enterPressed = event.keyCode === 13;
    const name = event.currentTarget.name;

    if (enterPressed && questionId) {
      event.preventDefault();

      if (name === 'editedTitle') {
        try {
          this.setState(() => ({ editTitleError: undefined }));
          await editQuestion({ variables: { questionId, title: editedTitle } });
          this.setState(() => ({ editTitleError: undefined, editingTitle: false }));
        } catch (err) {
          this.setState(() => ({ editTitleError: err.message }));
        }
      } else if (name === 'editedOrder') {
        try {
          this.setState(() => ({ editOrderError: undefined }));
          await editQuestion({ variables: { questionId, order: editedOrder } });
          this.setState(() => ({ editOrderError: undefined, editingOrder: false }));
        } catch (err) {
          this.setState(() => ({ editOrderError: err.message }));
        }
      }
    }
  }

  onBlur(event: React.FocusEvent<HTMLInputElement>) {
    const name = event.currentTarget.name;

    if (name === 'editedTitle') {
      this.setState(() => ({ editingTitle: false }));
    } else if (name === 'editedOrder') {
      this.setState(() => ({ editingOrder: false }));
    }
  }

  onClickToEditTitle() {
    this.setState(() => ({ editingTitle: true }));
    setTimeout(() => (this.focusInput(this.editTitleInput), 100));
  }

  onClickToEditOrder() {
    this.setState(() => ({ editingOrder: true }));
    setTimeout(() => (this.focusInput(this.editOrderInput), 100));
  }

  focusInput(input: HTMLInputElement | null) {
    if (input) {
      input.focus();
    }
  }

  renderAnswers() {
    const { question } = this.props;
    if (question && question.answers) {
      return question.answers.map(answer => (
        <AnswerCreateEdit key={answer ? answer.id : ''} answer={answer} questionId={question.id} />
      ));
    }
  }

  render() {
    const { question, questions, routeBase } = this.props;
    const {
      deleteConfirmationInProgress,
      deleteError,
      editedTitle,
      editingTitle,
      editTitleError,
      editedOrder,
      editingOrder,
      editOrderError,
    } = this.state;

    const outerContainerStyles = classNames(styles.container, {
      [styles.deleteConfirmationContainer]: deleteConfirmationInProgress,
    });
    const questionContainerStyles = classNames(styles.itemContainer, {
      [styles.hidden]: deleteConfirmationInProgress,
    });
    const deleteConfirmationStyles = classNames(styles.deleteConfirmation, {
      [styles.hidden]: !deleteConfirmationInProgress,
    });
    const deleteErrorStyles = classNames(styles.deleteError, {
      [styles.hidden]: !deleteConfirmationInProgress || !deleteError,
    });
    const titleTextStyles = classNames(styles.largeText, styles.title, {
      [styles.hidden]: editingTitle,
    });
    const titleEditStyles = classNames(styles.largeTextEditor, {
      [styles.hidden]: !editingTitle,
      [styles.error]: !!editTitleError,
    });
    const orderTextStyles = classNames(styles.largeText, {
      [styles.hidden]: editingOrder,
    });
    const orderEditStyles = classNames(styles.largeTextEditor, {
      [styles.hidden]: !editingOrder,
      [styles.error]: !!editOrderError,
    });

    const answers = this.renderAnswers();
    const closeRoute = routeBase || '/admin/questions';

    if (question) {
      return (
        <div className={outerContainerStyles}>
          <div className={deleteConfirmationStyles}>
            <div className={styles.deleteConfirmationIcon}></div>
            <div className={styles.deleteConfirmationText}>
              Are you ure you want to delete this question?
            </div>
            <div className={styles.deleteConfirmationButtons}>
              <div
                className={classNames(styles.deleteCancelButton, styles.invertedButton)}
                onClick={this.onCancelDelete}>
                Cancel
              </div>
              <div
                className={styles.deleteConfirmButton}
                onClick={this.onConfirmDelete}>
                Yes, delete
              </div>
            </div>
            <div className={deleteErrorStyles}>
              <div className={classNames(styles.redText, styles.smallText)}>
                Error deleting question.
              </div>
              <div className={styles.smallText}>Please try again.</div>
            </div>
          </div>
          <div className={questionContainerStyles}>
            <div className={styles.itemHeader}>
              <div className={styles.infoRow}>
                <div className={styles.controls}>
                  <Link to={closeRoute} className={styles.close}>Close</Link>
                  <div className={styles.menuItem} onClick={this.onClickDelete}>
                    <div className={styles.trashIcon}></div>
                    <div className={styles.menuLabel}>Delete question</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.itemBody}>
              <div className={styles.smallText}>Title:</div>
              <div
                ref={div => { this.titleBody = div; }}
                className={titleTextStyles}
                onClick={this.onClickToEditTitle}>
                {question.title}
              </div>
              <div className={titleEditStyles}>
                <input
                  name='editedTitle'
                  ref={area => { this.editTitleInput = area; }}
                  value={editedTitle}
                  onChange={this.onChange}
                  onKeyDown={this.onKeyDown}
                  onBlur={this.onBlur} />
              </div>
              <div className={styles.smallText}>Order:</div>
              <div
                ref={div => { this.orderBody = div; }}
                onClick={this.onClickToEditOrder}
                className={orderTextStyles}>
                {question.order}
              </div>
              <div className={orderEditStyles}>
                <input
                  type='number'
                  name='editedOrder'
                  ref={area => { this.editOrderInput = area; }}
                  value={editedOrder}
                  onChange={this.onChange}
                  onKeyDown={this.onKeyDown}
                  onBlur={this.onBlur} />
              </div>
              <br />
              <div className={styles.borderTop}>
                <br />
                <div className={styles.smallText}>Answer display:</div>
              </div>
              <select required
                name='answerType'
                value={question.answerType}
                onChange={this.onSelectChange}
                className={classNames(formStyles.select, formStyles.inputSmall)}>
                <option value='dropdown'>dropdown</option>
                <option value='radio'>radio</option>
                <option value='freetext'>freetext</option>
                <option value='multiselect'>multiselect</option>
              </select>
              <br />
              <div className={styles.smallText}>Answers:</div>
              <div>
                {answers}
              </div>
              <div className={styles.smallText}>Create answer:</div>
              <AnswerCreateEdit questionId={question.id} />
              <div className={styles.smallText}>Applicable if type:</div>
              <br />
              <select
                name='applicableIfType'
                value={question.applicableIfType || ''}
                onChange={this.onSelectChange}
                className={classNames(formStyles.select, formStyles.inputSmall)}>
                <option value='allTrue'>all true</option>
                <option value='oneTrue'>one true</option>
              </select>
              <br />
              <QuestionConditions
                questions={questions}
                questionConditions={question.applicableIfQuestionConditions}
                questionId={question.id} />
            </div>
          </div>
        </div>
      );
    } else {
      const { questionLoading, questionError } = this.props;
      if (questionLoading) {
        return (
          <div className={styles.container}>
            <div className={styles.loading}>Loading...</div>
          </div>
        );
      } else if (!!questionError) {
        return (
          <div className={styles.container}>
            <div className={styles.loadingError}>
              <div className={styles.loadingErrorIcon}></div>
              <div className={styles.loadingErrorLabel}>Unable to load question</div>
              <div className={styles.loadingErrorSubheading}>
                Sorry, something went wrong. Please try again.
              </div>
              <div
                className={classNames(styles.loadingErrorButton, styles.invertedButton)}
                onClick={this.reloadQuestion}>
                Try again
              </div>
            </div>
          </div>
        );
      } else {
        return <div className={styles.container}></div>;
      }
    }
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  return {
    questionId: ownProps.match ? ownProps.match.params.questionId : undefined,
  };
}

export default (compose as any)(
  connect(mapStateToProps),
  graphql(questionEditMutation as any, { name: 'editQuestion' }),
  graphql(questionQuery as any, {
    skip: (props: IProps) => !props.questionId,
    options: (props: IProps) => ({ variables: { questionId: props.questionId } }),
    props: ({ data }) => ({
      questionLoading: (data ? data.loading : false),
      questionError: (data ? data.error : null),
      question: (data ? (data as any).question : null),
      refetchQuestion: (data ? data.refetch : null),
    }),
  }),
)(Question);
