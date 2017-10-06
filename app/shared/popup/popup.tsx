import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './popup.css';

interface IProps {
  visible: boolean;
  children: any;
  smallPadding?: boolean;
}

export const Popup: React.StatelessComponent<IProps> = props => {
  // Eventually there will be a transition here...
  const { smallPadding } = props;

  const contentStyles = classNames(styles.content, {
    [styles.smallContentPadding]: !!smallPadding,
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
