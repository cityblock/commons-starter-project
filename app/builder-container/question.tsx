import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as questionQuery from '../graphql/queries/get-question.graphql';
import * as questionEditMutationGraphql from '../graphql/queries/question-edit-mutation.graphql';
import {
  questionEditMutation,
  questionEditMutationVariables,
  FullQuestionFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import SmallText from '../shared/library/small-text/small-text';
import TextInput from '../shared/library/text-input/text-input';
import { IState as IAppState } from '../store';
import AnswerCreateEdit from './answer-create-edit';
import QuestionConditions from './question-conditions';

interface IStateProps {
  questionId: string | null;
}

interface IProps {
  questions: FullQuestionFragment[];
  routeBase: string;
  match?: {
    params: {
      questionId: string | null;
    };
  };
}

interface IGraphqlProps {
  question?: FullQuestionFragment;
  loading: boolean;
  error: ApolloError | null | undefined;
  refetchQuestion: (() => any) | null;
  editQuestion: (
    options: { variables: questionEditMutationVariables },
  ) => { data: questionEditMutation };
  onDelete: (questionId: string) => any;
}

interface IState {
  deleteConfirmationInProgress: boolean;
  deleteError: string | null;
  editedTitle: string;
  editingTitle: boolean;
  editTitleError: string | null;
  editedOrder: number;
  editOrderError: string | null;
  editingOrder: boolean;
}

type allProps = IProps & IStateProps & IGraphqlProps;

export class Question extends React.Component<allProps, IState> {
  editTitleInput: HTMLInputElement | null;
  editOrderInput: HTMLInputElement | null;
  titleBody: HTMLDivElement | null;
  orderBody: HTMLDivElement | null;

  constructor(props: allProps) {
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
      deleteError: null,
      editedTitle: '',
      editingTitle: false,
      editedOrder: 1,
      editingOrder: false,
      editTitleError: null,
      editOrderError: null,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { question } = nextProps;

    if (question) {
      if (!this.props.question) {
        this.setState({
          editedTitle: question.title,
          editedOrder: question.order,
        });
      } else if (this.props.question.id !== question.id) {
        this.setState({
          editedTitle: question.title,
          editedOrder: question.order,
        });
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
      this.setState({ deleteConfirmationInProgress: true });
    }
  }

  async onConfirmDelete() {
    const { onDelete, questionId } = this.props;

    if (questionId) {
      try {
        this.setState({ deleteError: null });
        await onDelete(questionId);
        this.setState({ deleteConfirmationInProgress: false });
      } catch (err) {
        this.setState({ deleteError: err.message });
      }
    }
  }

  onCancelDelete() {
    this.setState({ deleteError: null, deleteConfirmationInProgress: false });
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    this.setState({ [name as any]: value || '' } as any);
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

    this.setState({ [name as any]: value || '' } as any);

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
          this.setState({ editTitleError: null });
          await editQuestion({ variables: { questionId, title: editedTitle } });
          this.setState({ editTitleError: null, editingTitle: false });
        } catch (err) {
          this.setState({ editTitleError: err.message });
        }
      } else if (name === 'editedOrder') {
        try {
          this.setState({ editOrderError: null });
          await editQuestion({ variables: { questionId, order: editedOrder } });
          this.setState({ editOrderError: null, editingOrder: false });
        } catch (err) {
          this.setState({ editOrderError: err.message });
        }
      }
    }
  }

  onBlur(event: React.FocusEvent<HTMLInputElement>) {
    const name = event.currentTarget.name;

    if (name === 'editedTitle') {
      this.setState({ editingTitle: false });
    } else if (name === 'editedOrder') {
      this.setState({ editingOrder: false });
    }
  }

  onClickToEditTitle() {
    this.setState({ editingTitle: true });
    setTimeout(() => (this.focusInput(this.editTitleInput), 100));
  }

  onClickToEditOrder() {
    this.setState({ editingOrder: true });
    setTimeout(() => (this.focusInput(this.editOrderInput), 100));
  }

  focusInput(input: HTMLInputElement | null) {
    if (input) {
      input.focus();
    }
  }

  getAnswerDataType() {
    const { question } = this.props;

    if (!question) {
      return null;
    }

    return question.computedField ? question.computedField.dataType : null;
  }

  renderAnswers() {
    const { question } = this.props;
    if (question && question.answers) {
      return question.answers
        .filter(answer => answer.id !== question.otherTextAnswerId)
        .map(answer => (
          <AnswerCreateEdit
            key={answer ? answer.id : ''}
            screeningToolAnswer={!!question.screeningToolId}
            answer={answer}
            questionId={question.id}
            dataType={this.getAnswerDataType() || undefined}
          />
        ));
    }
  }

  getQuestionsForConditions() {
    const { question, questions } = this.props;
    const filterableQuestions = questions || [];

    if (!question) {
      return [];
    }

    if (question.computedField) {
      return filterableQuestions.filter(q => !!q.computedField);
    } else {
      return filterableQuestions.filter(q => !q.computedField);
    }
  }

  render() {
    const { question, routeBase } = this.props;
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
    const closeRoute = routeBase || '/builder/questions';

    if (question) {
      const answerTypeNote =
        question.answerType === 'freetext' ? (
          <SmallText isBold={true} color="black" messageId="builder.freeTextNote" />
        ) : null;

      const answerDisplayHtml = question.computedField ? (
        <div className={styles.largeText}>{question.answerType}</div>
      ) : (
        <Select
          required
          name="answerType"
          value={question.answerType || 'Select one'}
          onChange={this.onSelectChange}
        >
          <Option value={'Select one'} disabled label="Select one (Required!)" />
          <Option value="dropdown" />
          <Option value="radio" />
          <Option value="freetext" />
          <Option value="multiselect" />
        </Select>
      );
      return (
        <div className={outerContainerStyles}>
          <div className={deleteConfirmationStyles}>
            <div className={styles.deleteConfirmationIcon} />
            <div className={styles.deleteConfirmationText}>
              Are you sure you want to delete this question?
            </div>
            <div className={styles.deleteConfirmationButtons}>
              <Button color="white" onClick={this.onCancelDelete} messageId="builder.cancel" />
              <Button onClick={this.onConfirmDelete} messageId="computedField.confirmDelete" />
            </div>
            <div className={deleteErrorStyles}>
              <div className={classNames(styles.redText, styles.smallText)}>
                Error deleting question.
              </div>
              <div className={styles.smallText}>Please try again.</div>
            </div>
          </div>
          <div className={questionContainerStyles}>
            <div>
              <div className={styles.infoRow}>
                <div className={styles.controls}>
                  <Link to={closeRoute} className={styles.close}>
                    Close
                  </Link>
                  <div className={styles.menuItem} onClick={this.onClickDelete}>
                    <div className={styles.trashIcon} />
                    <div className={styles.menuLabel}>Delete question</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.itemBody}>
              <div className={styles.smallText}>Title:</div>
              <div
                ref={div => {
                  this.titleBody = div;
                }}
                className={titleTextStyles}
                onClick={this.onClickToEditTitle}
              >
                {question.title}
              </div>
              <div className={titleEditStyles}>
                <TextInput
                  name="editedTitle"
                  inputRef={area => {
                    this.editTitleInput = area;
                  }}
                  value={editedTitle}
                  onChange={this.onChange}
                  onKeyDown={this.onKeyDown}
                  onBlur={this.onBlur}
                />
              </div>
              <div className={styles.smallText}>Order:</div>
              <div
                ref={div => {
                  this.orderBody = div;
                }}
                onClick={this.onClickToEditOrder}
                className={orderTextStyles}
              >
                {question.order}
              </div>
              <div className={orderEditStyles}>
                <TextInput
                  name="editedOrder"
                  inputRef={area => {
                    this.editOrderInput = area;
                  }}
                  value={editedOrder.toString()}
                  onChange={this.onChange}
                  onKeyDown={this.onKeyDown}
                  onBlur={this.onBlur}
                />
              </div>
              <div className={styles.smallText}>Computed Field:</div>
              <div className={styles.largeText}>
                {question.computedField ? question.computedField.slug : 'Not a computed field'}
              </div>
              <br />
              <div className={styles.borderTop}>
                <br />
                <div className={styles.smallText}>Answer display:</div>
              </div>
              {answerTypeNote}
              {answerDisplayHtml}
              <br />
              <div className={styles.smallText}>Answers:</div>
              <div>{answers}</div>
              <div className={styles.smallText}>Create answer:</div>
              <AnswerCreateEdit
                questionId={question.id}
                screeningToolAnswer={!!question.screeningToolId}
                dataType={this.getAnswerDataType() || undefined}
              />
              <br />
              <SmallText color="black" size="large" messageId="builder.applicableHeading" />
              <br />
              <SmallText color="black" size="medium" messageId="builder.applicableBody" />
              <br />
              <QuestionConditions
                questions={this.getQuestionsForConditions()}
                questionConditions={question.applicableIfQuestionConditions}
                questionId={question.id}
              />
              <div className={styles.smallText}>Applicable if type:</div>
              <br />
              <Select
                name="applicableIfType"
                value={question.applicableIfType || 'Select one'}
                onChange={this.onSelectChange}
              >
                <Option value={'Select one'} disabled={true} label="Select one (Required!)" />
                <Option value="oneTrue" label="one true" />
                <Option value="allTrue" label="all true" />
              </Select>
              <br />
            </div>
          </div>
        </div>
      );
    } else {
      const { loading, error } = this.props;
      if (loading) {
        return (
          <div className={styles.container}>
            <div className={styles.loading}>Loading...</div>
          </div>
        );
      } else if (!!error) {
        return (
          <div className={styles.container}>
            <div className={styles.loadingError}>
              <div className={styles.loadingErrorIcon} />
              <div className={styles.loadingErrorLabel}>Unable to load question</div>
              <div className={styles.loadingErrorSubheading}>
                Sorry, something went wrong. Please try again.
              </div>
              <Button onClick={this.reloadQuestion} label="Try again" />
            </div>
          </div>
        );
      } else {
        return <div className={styles.container} />;
      }
    }
  }
}

function mapStateToProps(state: IAppState, ownProps: allProps): IStateProps {
  return {
    questionId: ownProps.match ? ownProps.match.params.questionId : null,
  };
}

export default compose(
  connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql(questionEditMutationGraphql as any, {
    name: 'editQuestion',
  }),
  graphql(questionQuery as any, {
    skip: (props: IProps & IStateProps) => !props.questionId || props.questionId === 'builder',
    options: (props: IProps & IStateProps) => ({ variables: { questionId: props.questionId } }),
    props: ({ data }): Partial<IGraphqlProps> => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      question: data ? (data as any).question : null,
      refetchQuestion: data ? data.refetch : null,
    }),
  }),
)(Question) as React.ComponentClass<IProps>;
