import classNames from 'classnames';
import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import progressNoteTemplatesQuery from '../graphql/queries/get-progress-note-templates.graphql';
import progressNoteTemplateDeleteMutationGraphql from '../graphql/queries/progress-note-template-delete-mutation.graphql';
import {
  progressNoteTemplateDeleteMutation,
  progressNoteTemplateDeleteMutationVariables,
  FullProgressNoteTemplateFragment,
} from '../graphql/types';
import styles from '../shared/css/two-panel.css';
import Button from '../shared/library/button/button';
import { IState as IAppState } from '../store';
import ProgressNoteTemplate from './progress-note-template';
import ProgressNoteTemplateCreate from './progress-note-template-create';
import { ProgressNoteTemplateRow } from './progress-note-template-row';

interface IProps {
  mutate?: any;
  match: {
    params: {
      progressNoteTemplateId: string | null;
    };
  };
  history: History;
}

interface IStateProps {
  routeBase: string;
  progressNoteTemplateId: string | null;
}

interface IGraphqlProps {
  loading?: boolean;
  error: string | null;
  deleteProgressNoteTemplate: (
    options: { variables: progressNoteTemplateDeleteMutationVariables },
  ) => { data: progressNoteTemplateDeleteMutation };
  progressNoteTemplates?: FullProgressNoteTemplateFragment[];
  progressNoteTemplatesRefetch: () => any;
}

interface IState {
  showCreateProgressNoteTemplate: boolean;
}

type allProps = IProps & IStateProps & IGraphqlProps;

class BuilderProgressNoteTemplates extends React.Component<allProps, IState> {
  state = {
    showCreateProgressNoteTemplate: false,
  };

  showCreateProgressNoteTemplate = () => {
    this.setState({ showCreateProgressNoteTemplate: true });
  };

  hideCreateProgressNoteTemplate = () => {
    this.setState({ showCreateProgressNoteTemplate: false });
  };

  renderProgressNoteTemplates = (progressNoteTemplates: FullProgressNoteTemplateFragment[]) => {
    const { loading, error } = this.props;
    if (progressNoteTemplates.length > 0) {
      return progressNoteTemplates.map(this.renderProgressNoteTemplate);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyMessage}>
          <div className={styles.emptyLogo} />
          <div className={styles.emptyLabel}>No Progress Note Templates</div>
        </div>
      );
    }
  };

  renderProgressNoteTemplate = (progressNoteTemplate: FullProgressNoteTemplateFragment) => {
    const selected = progressNoteTemplate.id === this.props.progressNoteTemplateId;
    return (
      <ProgressNoteTemplateRow
        key={progressNoteTemplate.id}
        progressNoteTemplate={progressNoteTemplate}
        selected={selected}
        routeBase={this.props.routeBase}
      />
    );
  };

  onDeleteProgressNoteTemplate = async (progressNoteTemplateId: string) => {
    const { history, routeBase, deleteProgressNoteTemplate } = this.props;

    await deleteProgressNoteTemplate({ variables: { progressNoteTemplateId } });

    history.push(routeBase);
  };

  render() {
    const { progressNoteTemplates, routeBase, progressNoteTemplateId } = this.props;
    const { showCreateProgressNoteTemplate } = this.state;
    const progressNoteTemplatesList = progressNoteTemplates || [];
    const progressNoteTemplateContainerStyles = classNames(styles.itemContainer, {
      [styles.visible]: !!progressNoteTemplateId || showCreateProgressNoteTemplate,
    });
    const progressNoteTemplatesListStyles = classNames(styles.itemsList, {
      [styles.compressed]: !!progressNoteTemplateId || showCreateProgressNoteTemplate,
    });
    const createProgressNoteTemplateButton = (
      <div className={styles.createContainer}>
        <Button
          onClick={this.showCreateProgressNoteTemplate}
          messageId="builder.createProgressNoteTemplate"
        />
      </div>
    );

    const createProgressNoteTemplateHtml = showCreateProgressNoteTemplate ? (
      <ProgressNoteTemplateCreate
        progressNoteTemplateId={progressNoteTemplateId}
        onClose={this.hideCreateProgressNoteTemplate}
        routeBase={this.props.routeBase}
      />
    ) : null;
    const renderedProgressNoteTemplate = (props: any) => (
      <ProgressNoteTemplate
        progressNoteTemplates={progressNoteTemplates}
        routeBase={routeBase}
        onDelete={this.onDeleteProgressNoteTemplate}
        {...props}
      />
    );
    const progressNoteTemplateHtml = showCreateProgressNoteTemplate ? null : (
      <Route path={`${routeBase}/:progressNoteTemplateId`} render={renderedProgressNoteTemplate} />
    );
    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>{createProgressNoteTemplateButton}</div>
        <div className={styles.bottomContainer}>
          <div className={progressNoteTemplatesListStyles}>
            {this.renderProgressNoteTemplates(progressNoteTemplatesList)}
          </div>
          <div className={progressNoteTemplateContainerStyles}>
            {progressNoteTemplateHtml}
            {createProgressNoteTemplateHtml}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    progressNoteTemplateId: ownProps.match.params.progressNoteTemplateId,
    routeBase: '/builder/progress-note-templates',
  };
}

export default compose(
  withRouter,
  connect<IStateProps, {}, allProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql(progressNoteTemplateDeleteMutationGraphql, {
    name: 'deleteProgressNoteTemplate',
  }),
  graphql(progressNoteTemplatesQuery, {
    props: ({ data, ownProps }) => ({
      progressNoteTemplatesRefetch: data ? data.refetch : false,
      progressNoteTemplatesLoading: data ? data.loading : false,
      progressNoteTemplatesError: data ? data.error : null,
      progressNoteTemplates: data ? (data as any).progressNoteTemplates : null,
    }),
  }),
)(BuilderProgressNoteTemplates) as React.ComponentClass<IProps>;
