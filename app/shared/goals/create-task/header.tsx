import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../library/icon/icon';
import * as styles from './css/header.css';

interface IProps {
  closePopup: () => void;
}

const CreateTaskHeader: React.StatelessComponent<IProps> = (props: IProps) => {
  const { closePopup } = props;

  const addTask = (
    <FormattedMessage id="taskCreate.addTask">
      {(message: string) => <h2 className={styles.white}>{message}</h2>}
    </FormattedMessage>
  );

  const description = (
    <FormattedMessage id="taskCreate.detail">
      {(message: string) => <p className={styles.white}>{message}</p>}
    </FormattedMessage>
  );

  return (
    <div className={styles.container}>
      {addTask}
      {description}
      <Icon name="close" onClick={closePopup} className={styles.icon} />
    </div>
  );
};

export default CreateTaskHeader;
