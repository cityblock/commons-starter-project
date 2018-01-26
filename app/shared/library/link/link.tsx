import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link as ReactRouterLink, LinkProps } from 'react-router-dom';
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
  const linkStyles = classNames(styles.link, className);
  const linkProps: LinkProps = {
    to,
    className: linkStyles,
  };

  if (newTab) {
    (linkProps.target = '_blank'), (linkProps.rel = 'noopener noreferrer');
  }

  if (messageId) {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => <ReactRouterLink {...linkProps}>{message}</ReactRouterLink>}
      </FormattedMessage>
    );
  }

  return <ReactRouterLink {...linkProps}>{label || to}</ReactRouterLink>;
};

export default Link;
