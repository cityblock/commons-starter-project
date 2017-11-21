import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as screeningToolQuery from '../graphql/queries/get-screening-tool.graphql';
/* tslint:disable:max-line-length */
import * as screeningToolEditMutation from '../graphql/queries/screening-tool-edit-mutation.graphql';
/* tslint:enable:max-line-length */
import { screeningToolEditMutationVariables, FullScreeningToolFragment } from '../graphql/types';
import * as styles from '../shared/css/two-panel-right.css';
import { IState as IAppState } from '../store';
import ScoreRangeCreateEdit from './score-range-create-edit';

interface IProps {
  routeBase: string;
  refetchScreeningTool: () => any;
  match?: {
    params: {
      screeningToolId?: string;
    };
  };
  onDelete: (screeningToolId: string) => any;
}

interface IGraphqlProps {
  screeningTool?: FullScreeningToolFragment;
  screeningToolLoading?: boolean;
  screeningToolError?: string;
  editScreeningTool: (
    options: { variables: screeningToolEditMutationVariables },
  ) => { data: { screeningToolEdit: FullScreeningToolFragment } };
}

interface IStateProps {
  screeningToolId?: string;
}

interface IState {
  deleteConfirmationInProgress: boolean;
  deleteError?: string;
  editedTitle: string;
  editingTitle: boolean;
  editTitleError?: string;
}

type allProps = IGraphqlProps & IStateProps & IProps;

export class ScreeningTool extends React.Component<allProps, IState> {
  editTitleInput: HTMLInputElement | null;
  titleBody: HTMLDivElement | null;

  constructor(props: allProps) {
    super(props);

    this.reloadScreeningTool = this.reloadScreeningTool.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onCancelDelete = this.onCancelDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClickToEditTitle = this.onClickToEditTitle.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.renderScoreRanges = this.renderScoreRanges.bind(this);

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
    const { screeningTool } = nextProps;

    if (screeningTool) {
      if (!this.props.screeningTool || this.props.screeningTool.id !== screeningTool.id) {
        this.setState(() => ({
          editedTitle: screeningTool.title,
        }));
      }
    }
  }

  reloadScreeningTool() {
    const { refetchScreeningTool } = this.props;

    if (refetchScreeningTool) {
      refetchScreeningTool();
    }
  }

  onClickDelete() {
    const { screeningToolId } = this.props;

    if (screeningToolId) {
      this.setState(() => ({ deleteConfirmationInProgress: true }));
    }
  }

  async onConfirmDelete() {
    const { onDelete, screeningToolId } = this.props;

    if (screeningToolId) {
      try {
        this.setState(() => ({ deleteError: undefined }));
        await onDelete(screeningToolId);
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
    const { screeningToolId, editScreeningTool } = this.props;
    const { editedTitle } = this.state;
    const enterPressed = event.keyCode === 13;
    const name = event.currentTarget.name;

    if (enterPressed && screeningToolId) {
      event.preventDefault();

      if (name === 'editedTitle') {
        try {
          this.setState(() => ({ editTitleError: undefined }));
          await editScreeningTool({ variables: { screeningToolId, title: editedTitle } });
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

  renderScoreRanges() {
    const { screeningTool } = this.props;
    if (screeningTool && screeningTool.screeningToolScoreRanges) {
      return screeningTool.screeningToolScoreRanges.map(scoreRange => (
        <ScoreRangeCreateEdit
          key={scoreRange ? scoreRange.id : ''}
          scoreRange={scoreRange}
          screeningToolId={screeningTool.id}
        />
      ));
    }
  }

  render() {
    const { screeningTool, routeBase } = this.props;
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
    const screeningToolContainerStyles = classNames(styles.itemContainer, {
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
    const closeRoute = routeBase || '/builder/tools';
    const scoreRanges = this.renderScoreRanges();

    if (screeningTool) {
      return (
        <div className={outerContainerStyles}>
          <div className={deleteConfirmationStyles}>
            <div className={styles.deleteConfirmationIcon} />
            <div className={styles.deleteConfirmationText}>
              Are you sure you want to delete this screening tool?
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
                Error deleting screening tool.
              </div>
              <div className={styles.smallText}>Please try again.</div>
            </div>
          </div>
          <div className={screeningToolContainerStyles}>
            <div>
              <div className={styles.infoRow}>
                <div className={styles.controls}>
                  <Link to={closeRoute} className={styles.close}>
                    Close
                  </Link>
                  <div className={styles.menuItem} onClick={this.onClickDelete}>
                    <div className={styles.trashIcon} />
                    <div className={styles.menuLabel}>Delete screening tool</div>
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
                {screeningTool.title}
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
              <div className={styles.smallText}>Risk Area:</div>
              <div className={styles.largeText}>{screeningTool.riskArea.title}</div>
              <br />
              <div className={styles.smallText}>Score Ranges:</div>
              <div>{scoreRanges}</div>
              <div className={styles.smallText}>Create score range:</div>
              <ScoreRangeCreateEdit screeningToolId={screeningTool.id} />
            </div>
          </div>
        </div>
      );
    } else {
      const { screeningToolLoading, screeningToolError } = this.props;
      if (screeningToolLoading) {
        return (
          <div className={styles.container}>
            <div className={styles.loading}>Loading...</div>
          </div>
        );
      } else if (!!screeningToolError) {
        return (
          <div className={styles.container}>
            <div className={styles.loadingError}>
              <div className={styles.loadingErrorIcon} />
              <div className={styles.loadingErrorLabel}>Unable to load screening tool</div>
              <div className={styles.loadingErrorSubheading}>
                Sorry, something went wrong. Please try again.
              </div>
              <div
                className={classNames(styles.loadingErrorButton, styles.invertedButton)}
                onClick={this.reloadScreeningTool}
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
    screeningToolId: ownProps.match ? ownProps.match.params.screeningToolId : undefined,
  };
}

export default compose(
  connect<IStateProps, {}, IProps>(mapStateToProps as any),
  graphql<IGraphqlProps, IProps, allProps>(screeningToolEditMutation as any, {
    name: 'editScreeningTool',
  }),
  graphql<IGraphqlProps, IProps, allProps>(screeningToolQuery as any, {
    skip: (props: IProps & IStateProps) => !props.screeningToolId,
    options: (props: IProps & IStateProps) => ({
      variables: { screeningToolId: props.screeningToolId },
    }),
    props: ({ data }) => ({
      screeningToolLoading: data ? data.loading : false,
      screeningToolError: data ? data.error : null,
      screeningTool: data ? (data as any).screeningTool : null,
      refetcScreeningTool: data ? data.refetch : null,
    }),
  }),
)(ScreeningTool);
