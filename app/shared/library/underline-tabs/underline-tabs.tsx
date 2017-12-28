import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/underline-tabs.css';

type Color = 'gray' | 'white';

interface IProps {
  color?: Color; // background color, defaults to gray
  children?: any; // use UnderlineTab for tabs, wrap elements in div for space between styles
}

const UnderlineTabs: React.StatelessComponent<IProps> = (props: IProps) => {
  const { color, children } = props;
  const spaceBetween = Array.isArray(children) && children[0].type === 'div';

  const tabsStyles = classNames(styles.tabs, {
    [styles.white]: color && color === 'white',
    [styles.spaceBetween]: spaceBetween,
  });

  return <div className={tabsStyles}>{children}</div>;
};

export default UnderlineTabs;
