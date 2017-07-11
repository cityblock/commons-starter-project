import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl, InjectedIntl } from 'react-intl';
import { connect } from 'react-redux';
import * as styles from '../css/components/tasks-container.css';
import * as taskQuery from '../graphql/queries/get-task.graphql';
import * as tasksQuery from '../graphql/queries/tasks-for-current-user.graphql';
import { FullTaskFragment, ShortTaskFragment } from '../graphql/types';
import { IState as IAppState } from '../store';

export interface IProps {
  intl: InjectedIntl;
  loading: boolean;
  error?: string;
  taskId?: string;
  task?: FullTaskFragment;
  tasks: ShortTaskFragment[];
  match: {
    params: {
      taskId: string;
    };
  };
  updatePageParams: (tab: string) => any;
}

class TasksContainer extends React.Component<IProps, {}> {

  componentWillReceiveProps(newProps: IProps) {
    if (newProps.task) {
      document.title = `${newProps.task.title} | Commons`;
    } else {
      document.title = `My Tasks | Commons`;
    }
  }

  render() {
    return (
      <div className={styles.container}>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  return {
    taskId: ownProps.match.params.taskId,
  };
}

export default compose(
  injectIntl,
  connect(mapStateToProps),
  graphql(tasksQuery as any, {
    options: (props: IProps) => ({
      variables: {},
    }),
    props: ({ data }) => ({
      loading: (data ? data.loading : false),
      error: (data ? data.error : null),
      tasks: (data ? (data as any).tasksUserFollowing : null),
    }),
  }),
  graphql(taskQuery as any, {
    options: (props: IProps) => ({
      variables: {
        tasktId: props.taskId,
      },
    }),
    props: ({ data }) => ({
      loading: (data ? data.loading : false),
      error: (data ? data.error : null),
      task: (data ? (data as any).task : null),
    }),
  }),
)(TasksContainer);
