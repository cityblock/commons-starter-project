import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './popup.css';

export interface IProps {
  visible: boolean;
  children: any;
  smallPadding?: boolean;
}

export default class Popup extends React.Component<IProps, {}> {

  render() {
    // Eventually there will be a transition here...
    const { smallPadding } = this.props;

    const contentStyles = classNames(styles.content, {
      [styles.smallContentPadding]: !!smallPadding,
    });

    if (this.props.visible) {
      return (
        <div className={styles.background}>
          <div className={contentStyles}>
            {this.props.children}
          </div>
        </div>);
    }
    return <div />;
  }
}
