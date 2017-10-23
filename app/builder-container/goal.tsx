import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
/* tslint:disable:max-line-length */
import * as goalSuggestionTemplateQuery from '../graphql/queries/get-goal-suggestion-template.graphql';
import * as goalSuggestionTemplateEditMutationGraphql from '../graphql/queries/goal-suggestion-template-edit-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  goalSuggestionTemplateEditMutation,
  goalSuggestionTemplateEditMutationVariables,
  FullGoalSuggestionTemplateFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel-right.css';
import { IState as IAppState } from '../store';
import TaskTemplateCreateEdit from './task-template-create-edit';

interface IStateProps {
  goalId?: string;
}

interface IProps {
  routeBase: string;
  match?: {
    params: {
      objectId?: string;
    };
  };
}

interface IGraphqlProps {
  goal?: FullGoalSuggestionTemplateFragment;
  goalLoading?: boolean;
  goalError?: string;
  refetchGoal: () => any;
  editGoal: (
    options: { variables: goalSuggestionTemplateEditMutationVariables },
  ) => { data: goalSuggestionTemplateEditMutation };
  onDelete: (goalId: string) => any;
}

interface IState {
  deleteConfirmationInProgress: boolean;
  deleteError?: string;
  editedTitle: string;
  editingTitle: boolean;
  editTitleError?: string;
}

type allProps = IStateProps & IProps & IGraphqlProps;

export class Goal extends React.Component<allProps, IState> {
  editTitleInput: HTMLInputElement | null;
  titleBody: HTMLDivElement | null;

  constructor(props: allProps) {
    super(props);

    this.reloadGoal = this.reloadGoal.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onCancelDelete = this.onCancelDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClickToEditTitle = this.onClickToEditTitle.bind(this);
    this.focusInput = this.focusInput.bind(this);

    this.editTitleInput = null;
    this.titleBody = null;

    this.state = {
      deleteConfirmationInProgress: false,
      deleteError: undefined,
      editedTitle: '',
      editingTitle: false,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { goal } = nextProps;

    if (goal) {
      if (!this.props.goal) {
        this.setState(() => ({
          editedTitle: goal.title,
        }));
      } else if (this.props.goal.id !== goal.id) {
        this.setState(() => ({
          editedTitle: goal.title,
        }));
      }
    }
  }

  reloadGoal() {
    const { refetchGoal } = this.props;

    if (refetchGoal) {
      refetchGoal();
    }
  }

  onClickDelete() {
    const { goalId } = this.props;

    if (goalId) {
      this.setState(() => ({ deleteConfirmationInProgress: true }));
    }
  }

  async onConfirmDelete() {
    const { onDelete, goalId } = this.props;

    if (goalId) {
      try {
        this.setState(() => ({ deleteError: undefined }));
        await onDelete(goalId);
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

  async onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { goalId, editGoal } = this.props;
    const { editedTitle } = this.state;
    const enterPressed = event.keyCode === 13;
    const name = event.currentTarget.name;

    if (enterPressed && goalId) {
      event.preventDefault();

      if (name === 'editedTitle') {
        try {
          this.setState(() => ({ editTitleError: undefined }));
          await editGoal({ variables: { goalSuggestionTemplateId: goalId, title: editedTitle } });
          this.setState(() => ({ editTitleError: undefined, editingTitle: false }));
        } catch (err) {
          this.setState(() => ({ editTitleError: err.message }));
        }
      }
    }
  }

  onBlur(event: React.FocusEvent<HTMLInputElement>) {
    const name = event.currentTarget.name;

    if (name === 'editedTitle') {
      this.setState(() => ({ editingTitle: false }));
    }
  }

  onClickToEditTitle() {
    this.setState(() => ({ editingTitle: true }));
    setTimeout(() => (this.focusInput(this.editTitleInput), 100));
  }

  focusInput(input: HTMLInputElement | null) {
    if (input) {
      input.focus();
    }
  }

  renderTaskTemplates() {
    const { goal } = this.props;
    if (goal && goal.taskTemplates) {
      return goal.taskTemplates.map(taskTemplate => (
        <TaskTemplateCreateEdit
          key={taskTemplate ? taskTemplate.id : ''}
          taskTemplate={taskTemplate}
          goalSuggestionTemplateId={goal.id}
        />
      ));
    }
  }

  render() {
    const { goal, routeBase } = this.props;
    const {
      deleteConfirmationInProgress,
      deleteError,
      editedTitle,
      editingTitle,
      editTitleError,
    } = this.state;

    const outerContainerStyles = classNames(styles.container, {
      [styles.deleteConfirmationContainer]: deleteConfirmationInProgress,
    });
    const goalContainerStyles = classNames(styles.itemContainer, {
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

    const taskTemplates = this.renderTaskTemplates();
    const closeRoute = routeBase || '/builder/goals';

    if (goal) {
      return (
        <div className={outerContainerStyles}>
          <div className={deleteConfirmationStyles}>
            <div className={styles.deleteConfirmationIcon} />
            <div className={styles.deleteConfirmationText}>
              Are you sure you want to delete this goal?
            </div>
            <div className={styles.deleteConfirmationButtons}>
              <div
                className={classNames(styles.deleteCancelButton, styles.invertedButton)}
                onClick={this.onCancelDelete}
              >
                Cancel
              </div>
              <div className={styles.deleteConfirmButton} onClick={this.onConfirmDelete}>
                Yes, delete
              </div>
            </div>
            <div className={deleteErrorStyles}>
              <div className={classNames(styles.redText, styles.smallText)}>
                Error deleting goal.
              </div>
              <div className={styles.smallText}>Please try again.</div>
            </div>
          </div>
          <div className={goalContainerStyles}>
            <div>
              <div className={styles.infoRow}>
                <div className={styles.controls}>
                  <Link to={closeRoute} className={styles.close}>
                    Close
                  </Link>
                  <div className={styles.menuItem} onClick={this.onClickDelete}>
                    <div className={styles.trashIcon} />
                    <div className={styles.menuLabel}>Delete goal</div>
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
                {goal.title}
              </div>
              <div className={titleEditStyles}>
                <input
                  name='editedTitle'
                  ref={area => {
                    this.editTitleInput = area;
                  }}
                  value={editedTitle}
                  onChange={this.onChange}
                  onKeyDown={this.onKeyDown}
                  onBlur={this.onBlur}
                />
              </div>
              <br />
              <div className={styles.smallText}>Task Templates:</div>
              <div>{taskTemplates}</div>
              <div className={styles.smallText}>Create task template:</div>
              <TaskTemplateCreateEdit goalSuggestionTemplateId={goal.id} />
            </div>
          </div>
        </div>
      );
    } else {
      const { goalLoading, goalError } = this.props;
      if (goalLoading) {
        return (
          <div className={styles.container}>
            <div className={styles.loading}>Loading...</div>
          </div>
        );
      } else if (!!goalError) {
        return (
          <div className={styles.container}>
            <div className={styles.loadingError}>
              <div className={styles.loadingErrorIcon} />
              <div className={styles.loadingErrorLabel}>Unable to load goal</div>
              <div className={styles.loadingErrorSubheading}>
                Sorry, something went wrong. Please try again.
              </div>
              <div
                className={classNames(styles.loadingErrorButton, styles.invertedButton)}
                onClick={this.reloadGoal}
              >
                Try again
              </div>
            </div>
          </div>
        );
      } else {
        return <div className={styles.container} />;
      }
    }
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    goalId: ownProps.match ? ownProps.match.params.objectId : undefined,
  };
}

export default compose(
  connect<IStateProps, {}, IProps>(mapStateToProps),
  graphql(goalSuggestionTemplateEditMutationGraphql as any, { name: 'editGoal' }),
  graphql(goalSuggestionTemplateQuery as any, {
    skip: (props: allProps) => !props.goalId,
    options: (props: allProps) => ({ variables: { goalSuggestionTemplateId: props.goalId } }),
    props: ({ data }) => ({
      goalLoading: data ? data.loading : false,
      goalError: data ? data.error : null,
      goal: data ? (data as any).goalSuggestionTemplate : null,
      refetchGoal: data ? data.refetch : null,
    }),
  }),
)(Goal);
