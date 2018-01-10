import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/task-count-item.css';

interface IProps {
  messageId: string;
  count: number | null;
}

const TaskCountItem: React.StatelessComponent<IProps> = ({ count, messageId }) => {
  const renderedCount =
    count !== null ? (
      <p>{count}</p>
    ) : (
      <FormattedMessage id="dashboard.countLoading">
        {(message: string) => <p>{message}</p>}
      </FormattedMessage>
    );

  return (
    <div className={styles.container}>
      <FormattedMessage id={messageId}>{(message: string) => <h5>{message}</h5>}</FormattedMessage>
      {renderedCount}
    </div>
  );
};

export default TaskCountItem;
