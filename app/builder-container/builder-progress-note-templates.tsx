import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as progressNoteTemplatesQuery from '../graphql/queries/get-progress-note-templates.graphql';
import * as progressNoteTemplateDeleteMutationGraphql from '../graphql/queries/progress-note-template-delete-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  progressNoteTemplateDeleteMutation,
  progressNoteTemplateDeleteMutationVariables,
  FullProgressNoteTemplateFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel.css';
import { IState as IAppState } from '../store';
import ProgressNoteTemplate from './progress-note-template';
import ProgressNoteTemplateCreate from './progress-note-template-create';
import { ProgressNoteTemplateRow } from './progress-note-template-row';

interface IProps {
  mutate?: any;
  match: {
    params: {
      progressNoteTemplateId?: string;
    };
  };
}

interface IStateProps {
  routeBase: string;
  progressNoteTemplateId?: string;
}

interface IDispatchProps {
  redirectToProgressNoteTemplates: () => any;
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string;
  deleteProgressNoteTemplate: (
    options: { variables: progressNoteTemplateDeleteMutationVariables },
  ) => { data: progressNoteTemplateDeleteMutation };
  progressNoteTemplates?: FullProgressNoteTemplateFragment[];
  progressNoteTemplatesRefetch: () => any;
}

interface IState {
  showCreateProgressNoteTemplate: false;
}

type allProps = IProps & IStateProps & IDispatchProps & IGraphqlProps;

class BuilderProgressNoteTemplates extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.renderProgressNoteTemplates = this.renderProgressNoteTemplates.bind(this);
    this.renderProgressNoteTemplate = this.renderProgressNoteTemplate.bind(this);
    this.showCreateProgressNoteTemplate = this.showCreateProgressNoteTemplate.bind(this);
    this.hideCreateProgressNoteTemplate = this.hideCreateProgressNoteTemplate.bind(this);
    this.onDeleteProgressNoteTemplate = this.onDeleteProgressNoteTemplate.bind(this);

    this.state = {
      showCreateProgressNoteTemplate: false,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { loading, error } = nextProps;
    this.setState(() => ({ loading, error }));
  }

  showCreateProgressNoteTemplate() {
    this.setState(() => ({ showCreateProgressNoteTemplate: true }));
  }

  hideCreateProgressNoteTemplate() {
    this.setState(() => ({ showCreateProgressNoteTemplate: false }));
  }

  renderProgressNoteTemplates(progressNoteTemplates: FullProgressNoteTemplateFragment[]) {
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
  }

  renderProgressNoteTemplate(progressNoteTemplate: FullProgressNoteTemplateFragment) {
    const selected = progressNoteTemplate.id === this.props.progressNoteTemplateId;
    return (
      <ProgressNoteTemplateRow
        key={progressNoteTemplate.id}
        progressNoteTemplate={progressNoteTemplate}
        selected={selected}
        routeBase={this.props.routeBase}
      />
    );
  }

  async onDeleteProgressNoteTemplate(progressNoteTemplateId: string) {
    const { redirectToProgressNoteTemplates, deleteProgressNoteTemplate } = this.props;

    await deleteProgressNoteTemplate({ variables: { progressNoteTemplateId } });

    redirectToProgressNoteTemplates();
  }

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
        <div onClick={this.showCreateProgressNoteTemplate} className={styles.createButton}>
          Create Progress Note Template
        </div>
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

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: allProps): IDispatchProps {
  return {
    redirectToProgressNoteTemplates: () => {
      const { routeBase } = ownProps;
      dispatch(push(routeBase));
    },
  };
}

export default compose(
  connect<IStateProps, IDispatchProps, IProps>(mapStateToProps, mapDispatchToProps),
  graphql<IGraphqlProps, IProps>(progressNoteTemplateDeleteMutationGraphql as any, {
    name: 'deleteProgressNoteTemplate',
  }),
  graphql<IGraphqlProps, IProps>(progressNoteTemplatesQuery as any, {
    props: ({ data, ownProps }) => ({
      progressNoteTemplatesRefetch: data ? data.refetch : false,
      progressNoteTemplatesLoading: data ? data.loading : false,
      progressNoteTemplatesError: data ? data.error : null,
      progressNoteTemplates: data ? (data as any).progressNoteTemplates : null,
    }),
  }),
)(BuilderProgressNoteTemplates);
