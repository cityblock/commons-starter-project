import * as React from 'react';
import { graphql } from 'react-apollo';
import * as taskQuery from '../../graphql/queries/get-task.graphql';
import { FullTaskFragment } from '../../graphql/types';
import Button from '../library/button/button';
import * as styles from './css/task-cbo-add-information.css';
import TaskCBOAddInformationPopup from './task-cbo-add-information-popup';

interface IProps {
  taskId: string;
}

interface IGraphqlProps {
  task: FullTaskFragment;
  loading?: boolean;
  error?: string | null;
}

type allProps = IProps & IGraphqlProps;

interface IState {
  isPopupVisible: boolean;
}

export class TaskCBOAddInformation extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { isPopupVisible: false };
  }

  setPopupVisibility = (isPopupVisible: boolean): (() => void) => {
    return (): void => {
        this.setState({ isPopupVisible });
    };
  };

  render(): JSX.Element | null {
    const { task, loading, error } = this.props;
    if (loading || error) return null;

    return (
      <div>
        <TaskCBOAddInformationPopup
          task={task}
          isVisible={this.state.isPopupVisible}
          closePopup={this.setPopupVisibility(false)}
        />
        <Button
          messageId="task.CBOAddInfo"
          color="white"
          className={styles.button}
          onClick={this.setPopupVisibility(true)}
        />
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(taskQuery as any, {
  skip: (props: IProps) => !props.taskId,
  options: (props: IProps) => ({ variables: { taskId: props.taskId } }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    task: data ? (data as any).task : null,
  }),
})(TaskCBOAddInformation);
