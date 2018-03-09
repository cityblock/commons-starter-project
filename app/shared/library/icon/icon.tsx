import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/icon.css';
import iconComponents from './icon-components';
import { IconName } from './icon-types';

export type Color = 'gray' | 'darkGray' | 'white' | 'red' | 'blue' | 'green'; // default is gray

interface IProps {
  name: IconName;
  className?: string; // optional styles to be applied over defaults
  onClick?: (e?: any) => void; // optional click handler for icon
  color?: Color;
  isLarge?: boolean;
  isExtraLarge?: boolean;
}

const Icon: React.StatelessComponent<IProps> = (props: IProps) => {
  const { name, className, onClick, color, isLarge, isExtraLarge } = props;
  const IconComponent = iconComponents[name];
  const iconStyles = classNames(
    styles.icon,
    {
      [styles.darkGray]: color === 'darkGray',
      [styles.white]: color === 'white',
      [styles.red]: color === 'red',
      [styles.blue]: color === 'blue',
      [styles.green]: color === 'green',
      [styles.large]: isLarge,
      [styles.extraLarge]: isExtraLarge,
      [styles.hover]: !!onClick,
    },
    className,
  );

  return <IconComponent className={iconStyles} onClick={onClick} />;
};

export default Icon;
