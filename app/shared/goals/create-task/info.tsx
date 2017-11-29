import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/header.css';

interface IProps {
  goal: string;
  concern: string;
}

export const FormattedLabel: React.StatelessComponent<{ messageId: string }> = ({ messageId }) => (
  <FormattedMessage id={messageId}>{(message: string) => <h4>{message}</h4>}</FormattedMessage>
);

const CreateTaskHeader: React.StatelessComponent<IProps> = (props: IProps) => {
  const { concern, goal } = props;

  return (
    <div className={styles.detail}>
      <div className={styles.detailGroup}>
        <FormattedLabel messageId="taskCreate.concern" />
        <p>{concern}</p>
      </div>
      <div className={styles.detailGroup}>
        <FormattedLabel messageId="taskCreate.goal" />
        <p>{goal}</p>
      </div>
    </div>
  );
};

export default CreateTaskHeader;
