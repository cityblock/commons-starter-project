import * as React from 'react';
import { Popup } from '../popup/popup';
import * as styles from './popup-consent.css';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

export default class PopupConsent extends React.Component<IProps, {}> {
  render() {
    return (
      <Popup visible={this.props.visible}>
        <div className={styles.content}>
          <div className={styles.heading}>
            Please read the patient the following statement to ensure informed consent from the
            patient:
          </div>
          <div className={styles.paragraph}>
            We find that many patients wish to receive appointment reminders, health results, or
            coaching support through text messages and/or emails. Text messaging is not completely
            secure way to receive information because there is a chance these messages could be
            accessed improperly while they are being transmitted or stored. Knowing this risk, do
            you want us to send information to you by text message?
          </div>
          <div className={styles.paragraph}>
            By selecting <b>‘Yes’</b> the patient has been told of the risks inherent in electronic
            communications and has consented to receive texts.
          </div>
          <button className={styles.button} onClick={this.props.onClose}>
            Ok
          </button>
        </div>
      </Popup>
    );
  }
}
