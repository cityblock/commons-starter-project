import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link as ReactRouterLink } from 'react-router-dom';
import * as styles from './css/link.css';

interface IProps {
  to: string;
  messageId?: string; // prefer using translation
  label?: string; // use if not translating
  className?: string;
  newTab?: boolean; // if true, open link in new tab
}

const Link: React.StatelessComponent<IProps> = (props: IProps) => {
  const { to, messageId, label, className, newTab } = props;
  const target = newTab ? '_blank' : '_self';
  const linkStyles = classNames(styles.link, className);

  if (messageId) {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => (
          <ReactRouterLink to={to} className={linkStyles} target={target}>
            {message}
          </ReactRouterLink>
        )}
      </FormattedMessage>
    );
  }

  return (
    <ReactRouterLink to={to} className={linkStyles} target={target}>
      {label}
    </ReactRouterLink>
  );
};

export default Link;
