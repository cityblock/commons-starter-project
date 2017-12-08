import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as computedFieldDeleteMutationGraphql from '../graphql/queries/computed-field-delete-mutation.graphql';
/* tslint:enable:max-line-length */
import * as computedFieldsQuery from '../graphql/queries/get-computed-fields.graphql';
import {
  computedFieldDeleteMutation,
  computedFieldDeleteMutationVariables,
  FullComputedFieldFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel.css';
import Button from '../shared/library/button/button';
import { IState as IAppState } from '../store';
import ComputedField from './computed-field';
import ComputedFieldCreate from './computed-field-create';
import { ComputedFieldRow } from './computed-field-row';

interface IProps {
  mutate?: any;
  match: {
    params: {
      computedFieldId: string;
    };
  };
}

interface IGraphqlProps {
  computedFields?: FullComputedFieldFragment[];
  deleteComputedField: (
    options: { variables: computedFieldDeleteMutationVariables },
  ) => { data: computedFieldDeleteMutation };
}

interface IStateProps {
  routeBase: string;
  computedFieldId?: string;
}

interface IDispatchProps {
  redirectToComputedFields: () => any;
}

type allProps = IGraphqlProps & IDispatchProps & IProps & IStateProps;

interface IState {
  showCreateComputedField: boolean;
}

export class BuilderComputedFields extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      showCreateComputedField: false,
    };
  }

  showCreateComputedField = () => {
    this.setState({ showCreateComputedField: true });
  };

  hideCreateComputedField = () => {
    this.setState({ showCreateComputedField: false });
  };

  renderComputedFields() {
    const { computedFields } = this.props;
    const validComputedFields = (computedFields || []).filter(
      computedField => !computedField.deletedAt,
    );

    if (validComputedFields.length > 0) {
      return validComputedFields.map(this.renderComputedField);
    }
  }

  renderComputedField = (computedField: FullComputedFieldFragment) => {
    const { computedFieldId, routeBase } = this.props;
    const selected = computedField.id === computedFieldId;

    return (
      <ComputedFieldRow
        key={computedField.id}
        computedField={computedField}
        selected={selected}
        routeBase={routeBase}
      />
    );
  };

  onDeleteComputedField = async (computedFieldId: string) => {
    const { redirectToComputedFields, deleteComputedField } = this.props;

    await deleteComputedField({ variables: { computedFieldId } });

    redirectToComputedFields();
  };

  render() {
    const { routeBase, computedFieldId } = this.props;
    const { showCreateComputedField } = this.state;
    const computedFieldContainerStyles = classNames(styles.itemContainer, {
      [styles.visible]: !!computedFieldId || showCreateComputedField,
    });
    const computedFieldsListStyles = classNames(styles.itemsList, {
      [styles.compressed]: !!computedFieldId || showCreateComputedField,
    });
    const createComputedFieldButton = (
      <div className={styles.createContainer}>
        <Button onClick={this.showCreateComputedField} messageId="computedField.create" />
      </div>
    );
    const createComputedFieldHtml = showCreateComputedField ? (
      <ComputedFieldCreate onClose={this.hideCreateComputedField} routeBase={routeBase} />
    ) : null;
    const RenderedComputedField = (props: any) => (
      <ComputedField routeBase={routeBase} onDelete={this.onDeleteComputedField} {...props} />
    );
    const computedFieldHtml = showCreateComputedField ? null : (
      <Route path={`${routeBase}/:objectId`} render={RenderedComputedField} />
    );
    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>{createComputedFieldButton}</div>
        <div className={styles.bottomContainer}>
          <div className={computedFieldsListStyles}>{this.renderComputedFields()}</div>
          <div className={computedFieldContainerStyles}>
            {computedFieldHtml}
            {createComputedFieldHtml}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    computedFieldId: ownProps.match.params.computedFieldId,
    routeBase: '/builder/computed-fields',
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<() => void>,
  ownProps: IProps & IStateProps,
): IDispatchProps {
  return {
    redirectToComputedFields: () => {
      const { routeBase } = ownProps;
      dispatch(push(routeBase));
    },
  };
}

export default compose(
  connect<IStateProps, IDispatchProps, allProps>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
  graphql<IGraphqlProps, IProps, allProps>(computedFieldsQuery as any, {
    props: ({ data }) => ({
      computedFieldsLoading: data ? data.loading : false,
      computedFieldsError: data ? data.error : null,
      computedFields: data ? (data as any).computedFields : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(computedFieldDeleteMutationGraphql as any, {
    name: 'deleteComputedField',
  }),
)(BuilderComputedFields);
