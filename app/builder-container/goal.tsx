import classNames from 'classnames';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import goalSuggestionTemplate from '../graphql/queries/get-goal-suggestion-template.graphql';
import goalSuggestionTemplateEditGraphql from '../graphql/queries/goal-suggestion-template-edit-mutation.graphql';
import {
  goalSuggestionTemplateEdit,
  goalSuggestionTemplateEditVariables,
  FullGoalSuggestionTemplate,
} from '../graphql/types';
import styles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import { IState as IAppState } from '../store';
import TaskTemplateCreateEdit from './task-template-create-edit';

interface IStateProps {
  goalId: string | null;
}

interface IProps {
  routeBase: string;
  match?: {
    params: {
      objectId: string | null;
    };
  };
}

interface IGraphqlProps {
  goal?: FullGoalSuggestionTemplate;
  goalLoading?: boolean;
  goalError: string | null;
  refetchGoal: () => any;
  editGoal: (
    options: { variables: goalSuggestionTemplateEditVariables },
  ) => { data: goalSuggestionTemplateEdit; errors: Array<{ message: string }> };
  onDelete: (goalId: string) => any;
}

interface IState {
  deleteConfirmationInProgress: boolean;
  deleteError: string | null;
  editedTitle: string;
  editingTitle: boolean;
  editTitleError: string | null;
}

type allProps = IStateProps & IProps & IGraphqlProps;

export class Goal extends React.Component<allProps, IState> {
  editTitleInput: HTMLInputElement | null = null;
  titleBody: HTMLDivElement | null = null;
  state = {
    deleteConfirmationInProgress: false,
    deleteError: null,
    editedTitle: '',
    editingTitle: false,
    editTitleError: null,
  };

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
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { goal } = nextProps;

    if (goal) {
      if (!this.props.goal) {
        this.setState({
          editedTitle: goal.title,
        });
      } else if (this.props.goal.id !== goal.id) {
        this.setState({
          editedTitle: goal.title,
        });
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
      this.setState({ deleteConfirmationInProgress: true });
    }
  }

  async onConfirmDelete() {
    const { onDelete, goalId } = this.props;
    if (goalId) {
      try {
        this.setState({ deleteError: null });
        await onDelete(goalId);
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

  async onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { goalId, editGoal } = this.props;
    const { editedTitle } = this.state;
    const enterPressed = event.keyCode === 13;
    const name = event.currentTarget.name;

    if (enterPressed && goalId) {
      event.preventDefault();

      if (name === 'editedTitle') {
        try {
          this.setState({ editTitleError: null });
          await editGoal({ variables: { goalSuggestionTemplateId: goalId, title: editedTitle } });
          this.setState({ editTitleError: null, editingTitle: false });
        } catch (err) {
          this.setState({ editTitleError: err.message });
        }
      }
    }
  }

  onBlur(event: React.FocusEvent<HTMLInputElement>) {
    const name = event.currentTarget.name;

    if (name === 'editedTitle') {
      this.setState({ editingTitle: false });
    }
  }

  onClickToEditTitle() {
    this.setState({ editingTitle: true });
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
              <Button color="white" onClick={this.onCancelDelete} messageId="builder.cancel" />
              <Button onClick={this.onConfirmDelete} messageId="computedField.confirmDelete" />
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
                  name="editedTitle"
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
              <Button onClick={this.reloadGoal} label="Try again" />
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
    goalId: ownProps.match ? ownProps.match.params.objectId : null,
  };
}

export default compose(
  connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql(goalSuggestionTemplateEditGraphql, {
    name: 'editGoal',
  }),
  graphql(goalSuggestionTemplate, {
    skip: (props: IProps & IStateProps) => !props.goalId,
    options: (props: IProps & IStateProps) => ({
      variables: { goalSuggestionTemplateId: props.goalId },
    }),
    props: ({ data }) => ({
      goalLoading: data ? data.loading : false,
      goalError: data ? data.error : null,
      goal: data ? (data as any).goalSuggestionTemplate : null,
      refetchGoal: data ? data.refetch : null,
    }),
  }),
)(Goal) as React.ComponentClass<IProps>;
