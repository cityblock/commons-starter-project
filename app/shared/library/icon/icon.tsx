import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/icon.css';
import iconComponents from './icon-components';
import { IconName } from './icon-types';

export type Color = 'gray' | 'white'; // default is gray

interface IProps {
  name: IconName;
  className?: string; // optional styles to be applied over defaults
  onClick?: () => void; // optional click handler for icon
  color?: Color;
  isLarge?: boolean;
}

const Icon: React.StatelessComponent<IProps> = (props: IProps) => {
  const { name, className, onClick, color, isLarge } = props;
  const IconComponent = iconComponents[name];
  const iconStyles = classNames(
    styles.icon,
    {
      [styles.white]: color && color === 'white',
      [styles.large]: isLarge,
    },
    className,
  );

  return <IconComponent className={iconStyles} onClick={onClick} />;
};

export default Icon;
