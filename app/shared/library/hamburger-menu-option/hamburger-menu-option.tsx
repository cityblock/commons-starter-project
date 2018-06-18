import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../icon/icon';
import { IconName } from '../icon/icon-types';
import styles from './css/hamburger-menu-option.css';

interface IProps {
  messageId?: string; // prefer using translation for menu item text
  label?: string; // if not using translation pass label directly
  onClick: () => void;
  className?: string;
  icon?: IconName; // optional icon name for menu option
  iconStyles?: string; // optional icon styles to apply over defaults
}

const HamburgerMenuOption: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, label, onClick, className, icon, iconStyles } = props;
  const optionStyles = classNames(
    styles.option,
    {
      [styles.center]: !icon,
    },
    className,
  );

  const text = messageId ? (
    <FormattedMessage id={messageId}>{(message: string) => <p>{message}</p>}</FormattedMessage>
  ) : (
    <p>{label}</p>
  );

  return (
    <div onClick={onClick} className={optionStyles}>
      {icon && <Icon name={icon} className={classNames(styles.icon, iconStyles)} />}
      {text}
    </div>
  );
};

export default HamburgerMenuOption;
