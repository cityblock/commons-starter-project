import classNames from 'classnames';
import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import computedFieldDeleteMutationGraphql from '../graphql/queries/computed-field-delete-mutation.graphql';
import computedFieldsQuery from '../graphql/queries/get-computed-fields.graphql';
import {
  computedFieldDeleteMutation,
  computedFieldDeleteMutationVariables,
  FullComputedFieldFragment,
} from '../graphql/types';
import styles from '../shared/css/two-panel.css';
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
    path: string;
    url: string;
  };
  history: History;
}

interface IGraphqlProps {
  computedFields?: FullComputedFieldFragment[];
  deleteComputedField: (
    options: { variables: computedFieldDeleteMutationVariables },
  ) => { data: computedFieldDeleteMutation };
}

interface IStateProps {
  routeBase: string;
}

type allProps = IGraphqlProps & IProps & IStateProps;

interface IState {
  showCreateComputedField: boolean;
}

export class BuilderComputedFields extends React.Component<allProps, IState> {
  state = {
    showCreateComputedField: false,
  };

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
    const { match, routeBase } = this.props;
    const selected = computedField.id === match.params.computedFieldId;

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
    const { deleteComputedField, history, routeBase } = this.props;

    await deleteComputedField({ variables: { computedFieldId } });

    history.push(routeBase);
  };

  render() {
    const { routeBase, match } = this.props;
    const { showCreateComputedField } = this.state;
    const computedFieldContainerStyles = classNames(styles.itemContainer, {
      [styles.visible]: !!match.params.computedFieldId || showCreateComputedField,
    });
    const computedFieldsListStyles = classNames(styles.itemsList, {
      [styles.compressed]: !!match.params.computedFieldId || showCreateComputedField,
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
    routeBase: '/builder/computed-fields',
  };
}

export default compose(
  withRouter,
  connect<IStateProps, {}, allProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql(computedFieldsQuery, {
    props: ({ data }) => ({
      computedFieldsLoading: data ? data.loading : false,
      computedFieldsError: data ? data.error : null,
      computedFields: data ? (data as any).computedFields : null,
    }),
  }),
  graphql(computedFieldDeleteMutationGraphql, {
    name: 'deleteComputedField',
  }),
)(BuilderComputedFields) as React.ComponentClass<IProps>;
