import classNames from 'classnames';
import React from 'react';
import styles from './css/icon.css';
import iconComponents from './icon-components';
import { IconName } from './icon-types';

export type Color =
  | 'gray'
  | 'darkGray'
  | 'black'
  | 'white'
  | 'red'
  | 'blue'
  | 'green'
  | 'lightBlue'
  | 'teal'
  | 'purple'
  | 'yellow'; // default is gray

interface IProps {
  name: IconName;
  className?: string; // optional styles to be applied over defaults
  onClick?: (e?: any) => void; // optional click handler for icon
  color?: Color;
  isLarge?: boolean;
  isExtraLarge?: boolean;
  isSmall?: boolean;
}

const Icon: React.StatelessComponent<IProps> = (props: IProps) => {
  const { name, className, onClick, color, isSmall, isLarge, isExtraLarge } = props;
  const IconComponent = iconComponents[name];
  const iconStyles = classNames(
    styles.icon,
    {
      [styles.darkGray]: color === 'darkGray',
      [styles.black]: color === 'black',
      [styles.white]: color === 'white',
      [styles.red]: color === 'red',
      [styles.blue]: color === 'blue',
      [styles.green]: color === 'green',
      [styles.lightBlue]: color === 'lightBlue',
      [styles.teal]: color === 'teal',
      [styles.purple]: color === 'purple',
      [styles.yellow]: color === 'yellow',
      [styles.small]: isSmall,
      [styles.large]: isLarge,
      [styles.extraLarge]: isExtraLarge,
      [styles.hover]: !!onClick,
    },
    className,
  );

  return <IconComponent className={iconStyles} onClick={onClick} />;
};

export default Icon;
