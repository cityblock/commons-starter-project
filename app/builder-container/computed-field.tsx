import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as computedFieldQuery from '../graphql/queries/get-computed-field.graphql';
import { FullComputedFieldFragment } from '../graphql/types';
import * as styles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import { IState as IAppState } from '../store';

interface IStateProps {
  computedFieldId: string | null;
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
  computedField?: FullComputedFieldFragment;
  computedFieldLoading?: boolean;
  computedFieldError: string | null;
  refetchComputedField: () => any;
  onDelete: (computedFieldId: string) => any;
}

interface IState {
  deleteConfirmationInProgress: boolean;
  deleteError: string | null;
}

export type allProps = IProps & IStateProps & IGraphqlProps;

export class ComputedField extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { deleteConfirmationInProgress: false, deleteError: null };
  }

  reloadComputedField = () => {
    const { refetchComputedField } = this.props;

    if (refetchComputedField) {
      refetchComputedField();
    }
  };

  onClickDelete = () => {
    const { computedFieldId } = this.props;

    if (computedFieldId) {
      this.setState({ deleteConfirmationInProgress: true });
    }
  };

  onConfirmDelete = async () => {
    const { onDelete, computedFieldId } = this.props;

    if (computedFieldId) {
      try {
        this.setState({ deleteError: null });
        await onDelete(computedFieldId);
        this.setState({ deleteConfirmationInProgress: false });
      } catch (err) {
        this.setState({ deleteError: err.message });
      }
    }
  };

  onCancelDelete = () => {
    this.setState({ deleteError: null, deleteConfirmationInProgress: false });
  };

  render() {
    const { computedField, routeBase } = this.props;
    const { deleteConfirmationInProgress, deleteError } = this.state;

    const outerContainerStyles = classNames(styles.container, {
      [styles.deleteConfirmationContainer]: deleteConfirmationInProgress,
    });
    const computedFieldContainerStyles = classNames(styles.itemContainer, {
      [styles.hidden]: deleteConfirmationInProgress,
    });
    const deleteConfirmationStyles = classNames(styles.deleteConfirmation, {
      [styles.hidden]: !deleteConfirmationInProgress,
    });
    const deleteErrorStyles = classNames(styles.deleteError, {
      [styles.hidden]: !deleteConfirmationInProgress || !deleteError,
    });
    const labelTextStyles = classNames(styles.largeText, styles.title);

    const closeRoute = routeBase || '/builder/computed-fields';

    if (computedField) {
      return (
        <div className={outerContainerStyles}>
          <div className={deleteConfirmationStyles}>
            <div className={styles.deleteConfirmationIcon} />
            <div className={styles.deleteConfirmationText}>
              Are you sure you want to delete this computed field?
            </div>
            <div className={styles.deleteConfirmationButtons}>
              <Button
                onClick={this.onCancelDelete}
                color="white"
                messageId="computedFieldCreate.cancel"
              />
              <Button
                onClick={this.onConfirmDelete}
                messageId="computedField.confirmDelete"
                color="red"
              />
            </div>
            <div className={deleteErrorStyles}>
              <div className={classNames(styles.redText, styles.smallText)}>
                Error deleting computed field.
              </div>
              <div className={styles.smallText}>Please try again.</div>
            </div>
          </div>
          <div className={computedFieldContainerStyles}>
            <div>
              <div className={styles.infoRow}>
                <div className={styles.controls}>
                  <Link to={closeRoute} className={styles.close}>
                    Close
                  </Link>
                  <div className={styles.menuItem} onClick={this.onClickDelete}>
                    <div className={styles.trashIcon} />
                    <div className={styles.menuLabel}>Delete computed field</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.itemBody}>
              <div className={styles.smallText}>Label:</div>
              <div className={labelTextStyles}>{computedField.label}</div>
              <div className={styles.smallText}>Data Type:</div>
              <div className={styles.largeText}>{computedField.dataType}</div>
              <div className={styles.smallText}>Slug:</div>
              <div className={styles.largeText}>{computedField.slug}</div>
            </div>
          </div>
        </div>
      );
    } else {
      const { computedFieldLoading, computedFieldError } = this.props;
      if (computedFieldLoading) {
        return (
          <div className={styles.container}>
            <div className={styles.loading}>Loading...</div>
          </div>
        );
      } else if (!!computedFieldError) {
        return (
          <div className={styles.container}>
            <div className={styles.loadingError}>
              <div className={styles.loadingErrorIcon} />
              <div className={styles.loadingErrorLabel}>Unable to load computed field</div>
              <div className={styles.loadingErrorSubheading}>
                Sorry, something went wrong. Please try again.
              </div>
              <Button onClick={this.reloadComputedField} label="Try again" />
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
    computedFieldId: ownProps.match ? ownProps.match.params.objectId : null,
  };
}

export default compose(
  connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql<IGraphqlProps, IProps & IStateProps, allProps>(computedFieldQuery as any, {
    skip: (props: IProps & IStateProps) => !props.computedFieldId,
    options: (props: IProps & IStateProps) => ({
      variables: { computedFieldId: props.computedFieldId },
    }),
    props: ({ data }) => ({
      computedFieldLoading: data ? data.loading : false,
      computedFieldError: data ? data.error : null,
      computedField: data ? (data as any).computedField : null,
      refetchComputedField: data ? data.refetch : null,
    }),
  }),
)(ComputedField);
