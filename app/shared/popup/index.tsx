import * as React from 'react';
import * as styles from './popup.css';

export interface IProps {
  visible: boolean;
  children: any;
}

export default class Popup extends React.Component<IProps, {}> {

  render() {
    // Eventually there will be a transition here...
    if (this.props.visible) {
      return (
        <div className={styles.background}>
          <div className={styles.content}>
            {this.props.children}
          </div>
        </div>);
    }
    return <div />;
  }
}
