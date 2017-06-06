import * as React from 'react';
import * as styles from '../css/components/popup.css';

export interface IProps {
  visible: boolean;
  children: any;
}

class Popup extends React.Component<IProps, {}> {

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
    return null;
  }
}

export default Popup;
