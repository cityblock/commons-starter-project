import * as React from 'react';
import Popup from '../shared/popup';
import * as styles from './css/popup-enrollment-error.css';

export interface IProps {
  visible: boolean;
  error?: string;
  onClose: () => void;
}

class PopupEnrollmentError extends React.Component<IProps, {}> {

  render() {
    const { visible, error, onClose } = this.props;
    return (
      <Popup visible={visible}>
        <div className={styles.close} onClick={onClose} />
        <div className={styles.content}>
          <div className={styles.error} />
          <div className={styles.heading}>Unable to enroll this patient</div>
          <div className={styles.paragraph}>{error}</div>
        </div>
      </Popup>);
  }
}

export default PopupEnrollmentError;
