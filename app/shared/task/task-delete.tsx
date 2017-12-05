import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as taskDeleteMutationGraphql from '../../graphql/queries/task-delete-mutation.graphql';
import { taskDeleteMutationVariables } from '../../graphql/types';
import Button from '../library/button/button';
import * as styles from './css/task-delete.css';

interface IProps {
  mutate?: any;
  data?: any;
  taskId: string;
  cancelDelete: () => void;
  redirectToMap: () => void;
}

interface IGraphqlProps {
  deleteTask: (options: { variables: taskDeleteMutationVariables }) => void;
}

type allProps = IProps & IGraphqlProps;

interface IState {
  deleteError: string;
}

export class TaskDelete extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      deleteError: '',
    };
  }

  onConfirmDelete = async () => {
    const { taskId, deleteTask, cancelDelete, redirectToMap } = this.props;

    if (taskId) {
      try {
        this.setState({ deleteError: '' });
        await deleteTask({ variables: { taskId } });
        cancelDelete();
        redirectToMap();
      } catch (err) {
        this.setState({ deleteError: err.message });
      }
    }
  };

  render(): JSX.Element {
    const { cancelDelete } = this.props;
    const { deleteError } = this.state;

    const textStyles = deleteError ? styles.error : '';

    return (
      <div>
        <div className={styles.body}>
          <div className={styles.warningIcon} />
          <FormattedMessage id={deleteError ? 'taskDelete.titleError' : 'taskDelete.title'}>
            {(message: string) => <h2 className={textStyles}>{message}</h2>}
          </FormattedMessage>
          <FormattedMessage id={deleteError ? 'taskDelete.bodyError' : 'taskDelete.body'}>
            {(message: string) => <p className={textStyles}>{message}</p>}
          </FormattedMessage>
        </div>
        <div className={styles.options}>
          <Button
            messageId="taskDelete.cancel"
            onClick={cancelDelete}
            color="white"
            small={true}
            className={classNames(styles.button, styles.rightMargin)}
          />
          <Button
            messageId="taskDelete.confirm"
            onClick={this.onConfirmDelete}
            color="red"
            small={true}
            className={styles.button}
          />
        </div>
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(taskDeleteMutationGraphql as any, {
  name: 'deleteTask',
  options: {
    refetchQueries: ['getPatientCarePlan'],
  },
})(TaskDelete);
