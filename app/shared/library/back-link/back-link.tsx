import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Icon from '../icon/icon';
import styles from './css/back-link.css';

interface IProps {
  messageId?: string; // optional translate message, default is "Back"
  href: string;
}

const BackLink: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, href } = props;

  return (
    <FormattedMessage id={messageId || 'backLink.back'}>
      {(message: string) => (
        <Link to={href}>
          <div className={styles.link}>
            <Icon name="arrowBack" />
            <h5>{message}</h5>
          </div>
        </Link>
      )}
    </FormattedMessage>
  );
};

export default BackLink;
