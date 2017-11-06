import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './popup.css';

interface IProps {
  style?: 'no-padding' | 'small-padding';
  visible: boolean;
  children: any;
}

export const Popup: React.StatelessComponent<IProps> = props => {
  // Eventually there will be a transition here...
  const { style } = props;

  const contentStyles = classNames(styles.content, {
    [styles.smallContentPadding]: style === 'small-padding',
    [styles.noContentPadding]: style === 'no-padding',
  });

  if (props.visible) {
    return (
      <div className={styles.background}>
        <div className={contentStyles}>{props.children}</div>
      </div>
    );
  }
  return <div />;
};
