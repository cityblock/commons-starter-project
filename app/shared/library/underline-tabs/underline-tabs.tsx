import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/underline-tabs.css';

type Color = 'gray' | 'white';

interface IProps {
  color?: Color; // background color, defaults to gray
  children?: any; // in nearly all cases, should be Tab elements in shared folder
}

const UnderlineTabs: React.StatelessComponent<IProps> = (props: IProps) => {
  const { color, children } = props;
  const tabsStyles = classNames(styles.tabs, {
    [styles.white]: color && color === 'white',
  });

  return (
    <div className={tabsStyles}>
      {children}
    </div>
  );
};

export default UnderlineTabs;
