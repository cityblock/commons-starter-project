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
/* tslint:disable:max-line-length */
import EditableMultilineText from '../shared/library/editable-multiline-text/editable-multiline-text';
/* tslint:enable:max-line-length */
import { IState as IAppState } from '../store';

interface IStateProps {
  riskAreaId: string | null;
}

interface IProps {
  routeBase: string;
  match?: {
    params: {
      riskAreaId: string | null;
    };
  };
}

interface IGraphqlProps {
  riskArea?: FullRiskAreaFragment;
  riskAreaLoading?: boolean;
  riskAreaError: string | null;
  refetchRiskArea: () => any;
  editRiskArea: (
    options: { variables: riskAreaEditMutationVariables },
  ) => { data: riskAreaEditMutation };
  onDelete: (riskAreaId: string) => any;
}

interface IState {
  deleteConfirmationInProgress: boolean;
  deleteError: string | null;
}

type allProps = IProps & IStateProps & IGraphqlProps;

export class RiskArea extends React.Component<allProps, IState> {
  editTitleInput: HTMLInputElement | null;
  editOrderInput: HTMLInputElement | null;
  titleBody: HTMLDivElement | null;
  orderBody: HTMLDivElement | null;

  constructor(props: allProps) {
    super(props);

    this.state = {
      deleteConfirmationInProgress: false,
      deleteError: null,
    };
  }

  reloadRiskArea = () => {
    const { refetchRiskArea } = this.props;

    if (refetchRiskArea) {
      refetchRiskArea();
    }
  };

  onClickDelete = () => {
    const { riskAreaId } = this.props;

    if (riskAreaId) {
      this.setState({ deleteConfirmationInProgress: true });
    }
  };

  onConfirmDelete = async () => {
    const { onDelete, riskAreaId } = this.props;

    if (riskAreaId) {
      try {
        this.setState({ deleteError: null });
        await onDelete(riskAreaId);
        this.setState({ deleteConfirmationInProgress: false });
      } catch (err) {
        this.setState({ deleteError: err.message });
      }
    }
  };

  onCancelDelete = () => {
    this.setState({ deleteError: null, deleteConfirmationInProgress: false });
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    this.setState({ [name as any]: value || '' });
  };

  onEnterPress = (field: string) => {
    const { riskAreaId, editRiskArea } = this.props;

    return async (newText: string) => {
      if (!riskAreaId) return;

      await editRiskArea({
        variables: {
          riskAreaId,
          [field]: newText,
        },
      });
    };
  };

  render() {
    const { riskArea, routeBase } = this.props;
    const { deleteConfirmationInProgress, deleteError } = this.state;

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

    const closeRoute = routeBase || '/builder/riskAreas';
    if (riskArea) {
      return (
        <div className={outerContainerStyles}>
          <div className={deleteConfirmationStyles}>
            <div className={styles.deleteConfirmationIcon} />
            <div className={styles.deleteConfirmationText}>
              Are you sure you want to delete this assessment?
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
                Error deleting assessment.
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
                    <div className={styles.menuLabel}>Delete assessment</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.itemBody}>
              <p>Title:</p>
              <EditableMultilineText
                text={riskArea.title}
                onEnterPress={this.onEnterPress('title')}
              />
              <p>Domain:</p>
              {riskArea.riskAreaGroup && (
                <p className={styles.uneditable}>{riskArea.riskAreaGroup.title}</p>
              )}
              <p>Assessment Type:</p>
              <p className={styles.uneditable}>{riskArea.assessmentType}</p>
              <p>Order:</p>
              <EditableMultilineText
                text={`${riskArea.order}`}
                onEnterPress={this.onEnterPress('order')}
              />
              <p>Medium Risk Threshold:</p>
              <EditableMultilineText
                text={`${riskArea.mediumRiskThreshold}`}
                onEnterPress={this.onEnterPress('mediumRiskThreshold')}
              />
              <p>High Risk Threshold:</p>
              <EditableMultilineText
                text={`${riskArea.highRiskThreshold}`}
                onEnterPress={this.onEnterPress('highRiskThreshold')}
              />
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
              <div className={styles.loadingErrorLabel}>Unable to load assessment</div>
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
    riskAreaId: ownProps.match ? ownProps.match.params.riskAreaId : null,
  };
}

export default compose(
  connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql<IGraphqlProps, IProps, allProps>(riskAreaEditMutationGraphql as any, {
    name: 'editRiskArea',
  }),
  graphql<IGraphqlProps, IProps & IStateProps, allProps>(riskAreaQuery as any, {
    skip: (props: IProps & IStateProps) => !props.riskAreaId,
    options: (props: IProps & IStateProps) => ({ variables: { riskAreaId: props.riskAreaId } }),
    props: ({ data }) => ({
      riskAreaLoading: data ? data.loading : false,
      riskAreaError: data ? data.error : null,
      riskArea: data ? (data as any).riskArea : null,
      refetchRiskArea: data ? data.refetch : null,
    }),
  }),
)(RiskArea);
