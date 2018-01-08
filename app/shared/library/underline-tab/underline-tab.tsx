import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import * as styles from './css/underline-tab.css';

interface IProps {
  messageId: string; // message id for translation
  selected: boolean;
  href?: string; // where to link to on tab click
  onClick?: () => void; // click handler, use if not using href
  displayNotificationBadge?: boolean;
}

const UnderlineTab: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, selected, href, onClick, displayNotificationBadge } = props;
  const tabStyles = classNames(styles.tab, {
    [styles.selected]: selected,
  });

  if (displayNotificationBadge && href) {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => (
          <Link className={tabStyles} to={href}>
            <span>{message}</span>
            <div className={styles.notificationBadge} />
          </Link>
        )}
      </FormattedMessage>
    );
  } else if (href) {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => (
          <Link to={href} className={tabStyles}>
            {message}
          </Link>
        )}
      </FormattedMessage>
    );
  } else {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => (
          <h2 onClick={onClick} className={tabStyles}>
            {message}
          </h2>
        )}
      </FormattedMessage>
    );
  }
};

export default UnderlineTab;
