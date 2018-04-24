import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as concernEditMutationGraphql from '../graphql/queries/concern-edit-mutation.graphql';
import * as concernQuery from '../graphql/queries/get-concern.graphql';
import {
  concernEditMutation,
  concernEditMutationVariables,
  FullConcernFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import { IState as IAppState } from '../store';
import ConcernDiagnosisCodes from './concern-diagnosis-codes';

interface IStateProps {
  concernId: string | null;
}

interface IProps {
  routeBase: string;
  match?: {
    params: {
      objectId: string | null;
    };
  };
  mutate?: any;
}

interface IGraphqlProps {
  concern?: FullConcernFragment;
  concernLoading?: boolean;
  concernError: string | null;
  refetchConcern: () => any;
  editConcern: (
    options: { variables: concernEditMutationVariables },
  ) => { data: concernEditMutation };
  onDelete: (concernId: string) => any;
}

interface IState {
  deleteConfirmationInProgress: boolean;
  deleteError: string | null;
  editedTitle: string;
  editingTitle: boolean;
  editTitleError: string | null;
}

type allProps = IProps & IStateProps & IGraphqlProps;

export class Concern extends React.Component<allProps, IState> {
  editTitleInput: HTMLInputElement | null;
  titleBody: HTMLDivElement | null;

  constructor(props: allProps) {
    super(props);

    this.reloadConcern = this.reloadConcern.bind(this);
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
      deleteError: null,
      editedTitle: '',
      editingTitle: false,
      editTitleError: null,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { concern } = nextProps;

    if (concern) {
      if (!this.props.concern) {
        this.setState({ editedTitle: concern.title });
      } else if (this.props.concern.id !== concern.id) {
        this.setState({ editedTitle: concern.title });
      }
    }
  }

  reloadConcern() {
    const { refetchConcern } = this.props;

    if (refetchConcern) {
      refetchConcern();
    }
  }

  onClickDelete() {
    const { concernId } = this.props;

    if (concernId) {
      this.setState({ deleteConfirmationInProgress: true });
    }
  }

  async onConfirmDelete() {
    const { onDelete, concernId } = this.props;

    if (concernId) {
      try {
        this.setState({ deleteError: null });
        await onDelete(concernId);
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

    this.setState({ [name as any]: value || '' });
  }

  async onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { concernId, editConcern } = this.props;
    const { editedTitle } = this.state;
    const enterPressed = event.keyCode === 13;
    const name = event.currentTarget.name;

    if (enterPressed && concernId) {
      event.preventDefault();

      if (name === 'editedTitle') {
        try {
          this.setState({ editTitleError: null });
          await editConcern({ variables: { concernId, title: editedTitle } });
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

  render() {
    const { concern, routeBase } = this.props;
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
    const concernContainerStyles = classNames(styles.itemContainer, {
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

    const closeRoute = routeBase || '/builder/concerns';

    if (concern) {
      return (
        <div className={outerContainerStyles}>
          <div className={deleteConfirmationStyles}>
            <div className={styles.deleteConfirmationIcon} />
            <div className={styles.deleteConfirmationText}>
              Are you sure you want to delete this concern?
            </div>
            <div className={styles.deleteConfirmationButtons}>
              <Button color="white" onClick={this.onCancelDelete} messageId="builder.cancel" />
              <Button onClick={this.onConfirmDelete} messageId="computedField.confirmDelete" />
            </div>
            <div className={deleteErrorStyles}>
              <div className={classNames(styles.redText, styles.smallText)}>
                Error deleting concern.
              </div>
              <div className={styles.smallText}>Please try again.</div>
            </div>
          </div>
          <div className={concernContainerStyles}>
            <div>
              <div className={styles.infoRow}>
                <div className={styles.controls}>
                  <Link to={closeRoute} className={styles.close}>
                    Close
                  </Link>
                  <div className={styles.menuItem} onClick={this.onClickDelete}>
                    <div className={styles.trashIcon} />
                    <div className={styles.menuLabel}>Delete concern</div>
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
                {concern.title}
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
              <ConcernDiagnosisCodes
                concernId={concern.id}
                diagnosisCodes={concern.diagnosisCodes}
              />
            </div>
          </div>
        </div>
      );
    } else {
      const { concernLoading, concernError } = this.props;
      if (concernLoading) {
        return (
          <div className={styles.container}>
            <div className={styles.loading}>Loading...</div>
          </div>
        );
      } else if (!!concernError) {
        return (
          <div className={styles.container}>
            <div className={styles.loadingError}>
              <div className={styles.loadingErrorIcon} />
              <div className={styles.loadingErrorLabel}>Unable to load concern</div>
              <div className={styles.loadingErrorSubheading}>
                Sorry, something went wrong. Please try again.
              </div>
              <Button onClick={this.reloadConcern} label="Try again" />
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
    concernId: ownProps.match ? ownProps.match.params.objectId : null,
  };
}

export default compose(
  connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql(concernEditMutationGraphql as any, {
    name: 'editConcern',
  }),
  graphql(concernQuery as any, {
    skip: (props: IProps & IStateProps) => !props.concernId,
    options: (props: IProps & IStateProps) => ({ variables: { concernId: props.concernId } }),
    props: ({ data }) => ({
      concernLoading: data ? data.loading : false,
      concernError: data ? data.error : null,
      concern: data ? (data as any).concern : null,
      refetchConcern: data ? data.refetch : null,
    }),
  }),
)(Concern) as React.ComponentClass<IProps>;
