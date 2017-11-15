import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as riskAreaQuery from '../graphql/queries/get-risk-area.graphql';
import * as riskAreaEditMutationGraphql from '../graphql/queries/risk-area-edit-mutation.graphql';
import {
  riskAreaEditMutation,
  riskAreaEditMutationVariables,
  FullRiskAreaFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel-right.css';
import { IState as IAppState } from '../store';

interface IStateProps {
  riskAreaId?: string;
}

interface IProps {
  routeBase: string;
  match?: {
    params: {
      riskAreaId?: string;
    };
  };
}

interface IGraphqlProps {
  riskArea?: FullRiskAreaFragment;
  riskAreaLoading?: boolean;
  riskAreaError?: string;
  refetchRiskArea: () => any;
  editRiskArea: (
    options: { variables: riskAreaEditMutationVariables },
  ) => { data: riskAreaEditMutation };
  onDelete: (riskAreaId: string) => any;
}

interface IState {
  deleteConfirmationInProgress: boolean;
  deleteError?: string;
  editedTitle: string;
  editingTitle: boolean;
  editTitleError?: string;
  editedOrder: number;
  editOrderError?: string;
  editingOrder: boolean;
}

type allProps = IProps & IStateProps & IGraphqlProps;

export class RiskArea extends React.Component<allProps, IState> {
  editTitleInput: HTMLInputElement | null;
  editOrderInput: HTMLInputElement | null;
  titleBody: HTMLDivElement | null;
  orderBody: HTMLDivElement | null;

  constructor(props: allProps) {
    super(props);

    this.reloadRiskArea = this.reloadRiskArea.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onCancelDelete = this.onCancelDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClickToEditTitle = this.onClickToEditTitle.bind(this);
    this.onClickToEditOrder = this.onClickToEditOrder.bind(this);
    this.focusInput = this.focusInput.bind(this);

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

  componentWillReceiveProps(nextProps: allProps) {
    const { riskArea } = nextProps;

    if (riskArea) {
      if (!this.props.riskArea) {
        this.setState(() => ({
          editedTitle: riskArea.title,
          editedOrder: riskArea.order,
        }));
      } else if (this.props.riskArea.id !== riskArea.id) {
        this.setState(() => ({
          editedTitle: riskArea.title,
          editedOrder: riskArea.order,
        }));
      }
    }
  }

  reloadRiskArea() {
    const { refetchRiskArea } = this.props;

    if (refetchRiskArea) {
      refetchRiskArea();
    }
  }

  onClickDelete() {
    const { riskAreaId } = this.props;

    if (riskAreaId) {
      this.setState(() => ({ deleteConfirmationInProgress: true }));
    }
  }

  async onConfirmDelete() {
    const { onDelete, riskAreaId } = this.props;

    if (riskAreaId) {
      try {
        this.setState(() => ({ deleteError: undefined }));
        await onDelete(riskAreaId);
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
    const { riskAreaId, editRiskArea } = this.props;
    const { editedTitle, editedOrder } = this.state;
    const enterPressed = event.keyCode === 13;
    const name = event.currentTarget.name;

    if (enterPressed && riskAreaId) {
      event.preventDefault();

      if (name === 'editedTitle') {
        try {
          this.setState(() => ({ editTitleError: undefined }));
          await editRiskArea({ variables: { riskAreaId, title: editedTitle } });
          this.setState(() => ({ editTitleError: undefined, editingTitle: false }));
        } catch (err) {
          this.setState(() => ({ editTitleError: err.message }));
        }
      } else if (name === 'editedOrder') {
        try {
          this.setState(() => ({ editOrderError: undefined }));
          await editRiskArea({ variables: { riskAreaId, order: editedOrder } });
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

  render() {
    const { riskArea, routeBase } = this.props;
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
    const riskAreaContainerStyles = classNames(styles.itemContainer, {
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

    const closeRoute = routeBase || '/builder/riskAreas';

    if (riskArea) {
      return (
        <div className={outerContainerStyles}>
          <div className={deleteConfirmationStyles}>
            <div className={styles.deleteConfirmationIcon} />
            <div className={styles.deleteConfirmationText}>
              Are you sure you want to delete this domain?
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
                Error deleting domain.
              </div>
              <div className={styles.smallText}>Please try again.</div>
            </div>
          </div>
          <div className={riskAreaContainerStyles}>
            <div>
              <div className={styles.infoRow}>
                <div className={styles.controls}>
                  <Link to={closeRoute} className={styles.close}>
                    Close
                  </Link>
                  <div className={styles.menuItem} onClick={this.onClickDelete}>
                    <div className={styles.trashIcon} />
                    <div className={styles.menuLabel}>Delete domain</div>
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
                {riskArea.title}
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
              <div className={styles.smallText}>Order:</div>
              <div
                ref={div => {
                  this.orderBody = div;
                }}
                onClick={this.onClickToEditOrder}
                className={orderTextStyles}
              >
                {riskArea.order}
              </div>
              <div className={orderEditStyles}>
                <input
                  type="number"
                  name="editedOrder"
                  ref={area => {
                    this.editOrderInput = area;
                  }}
                  value={editedOrder}
                  onChange={this.onChange}
                  onKeyDown={this.onKeyDown}
                  onBlur={this.onBlur}
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      const { riskAreaLoading, riskAreaError } = this.props;
      if (riskAreaLoading) {
        return (
          <div className={styles.container}>
            <div className={styles.loading}>Loading...</div>
          </div>
        );
      } else if (!!riskAreaError) {
        return (
          <div className={styles.container}>
            <div className={styles.loadingError}>
              <div className={styles.loadingErrorIcon} />
              <div className={styles.loadingErrorLabel}>Unable to load domain</div>
              <div className={styles.loadingErrorSubheading}>
                Sorry, something went wrong. Please try again.
              </div>
              <div
                className={classNames(styles.loadingErrorButton, styles.invertedButton)}
                onClick={this.reloadRiskArea}
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
    riskAreaId: ownProps.match ? ownProps.match.params.riskAreaId : undefined,
  };
}

export default compose(
  connect<IStateProps, {}, IProps>(mapStateToProps),
  graphql<IGraphqlProps, IProps>(riskAreaEditMutationGraphql as any, { name: 'editRiskArea' }),
  graphql<IGraphqlProps, IProps>(riskAreaQuery as any, {
    skip: (props: allProps) => !props.riskAreaId,
    options: (props: allProps) => ({ variables: { riskAreaId: props.riskAreaId } }),
    props: ({ data }) => ({
      riskAreaLoading: data ? data.loading : false,
      riskAreaError: data ? data.error : null,
      riskArea: data ? (data as any).riskArea : null,
      refetchRiskArea: data ? data.refetch : null,
    }),
  }),
)(RiskArea);
