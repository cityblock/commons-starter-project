import classNames from 'classnames';
import React from 'react';
import styles from './css/underline-tabs.css';

type Color = 'gray' | 'white';

interface IProps {
  color?: Color; // background color, defaults to gray
  children?: any; // use UnderlineTab for tabs, wrap elements in div for space between styles
  className?: string; // optional styles to apply over defaults
}

const UnderlineTabs: React.StatelessComponent<IProps> = (props: IProps) => {
  const { color, children, className } = props;
  const spaceBetween = Array.isArray(children) && children[0].type === 'div';

  const tabsStyles = classNames(
    styles.tabs,
    {
      [styles.white]: color && color === 'white',
      [styles.spaceBetween]: spaceBetween,
    },
    className,
  );

  return <div className={tabsStyles}>{children}</div>;
};

export default UnderlineTabs;
