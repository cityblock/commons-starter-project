import * as React from 'react';
import Button from '../library/button/button';
import * as styles from './css/task-cbo-add-information.css';

interface IProps {
  taskId: string;
}

const TaskCBOAddInformation: React.StatelessComponent<IProps> = (props: IProps) => {
  return (
    <Button
      messageId="task.CBOAddInfo"
      color="white"
      className={styles.button}
      onClick={() => true as any}
    />
  );
};

export default TaskCBOAddInformation;
