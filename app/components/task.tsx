import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { selectTask } from '../actions/task-action';
import * as styles from '../css/components/task.css';
import * as taskQuery from '../graphql/queries/get-task.graphql';
import { FullTaskFragment } from '../graphql/types';
import { IState as IAppState } from '../store';

export interface IProps {
  task?: FullTaskFragment;
  taskId?: string;
  taskLoading?: boolean;
  taskError?: string;
  selectTask: (taskId?: string) => any;
  match?: {
    params: {
      taskId?: string;
    };
  };
}

class Task extends React.Component<IProps, {}> {

  componentWillMount() {
    if (this.props.taskId) {
      this.props.selectTask(this.props.taskId);
    }
  }

  componentWillUnmount() {
    this.props.selectTask(undefined);
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (this.props.taskId !== nextProps.taskId) {
      this.props.selectTask(nextProps.taskId);
    }
  }

  render() {
    return (
      <div className={styles.container}>
        task
      </div>);
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  return {
    taskId: ownProps.match ? ownProps.match.params.taskId : undefined,
  };
}

function mapDispatchToProps(dispatch: Dispatch<() => void>): Partial<IProps> {
  return {
    selectTask: (taskId?: string) => dispatch(selectTask(taskId)),
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(taskQuery as any, {
    skip: (props: IProps) => !props.taskId,
    options: (props: IProps) => ({ variables: { taskId: props.taskId } }),
    props: ({ data }) => ({
      taskLoading: (data ? data.loading : false),
      taskError: (data ? data.error : null),
      task: (data ? (data as any).task : null),
    }),
  }),
)(Task);
