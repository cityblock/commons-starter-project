import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/icon.css';
import iconComponents from './icon-components';
import { IconName } from './icon-types';

interface IProps {
  name: IconName;
  className?: string;
}

const Icon: React.StatelessComponent<IProps> = ({ name, className }) => {
  const IconComponent = iconComponents[name];
  const iconStyles = classNames(styles.icon, className);

  return <IconComponent className={iconStyles} />;
};

export default Icon;
