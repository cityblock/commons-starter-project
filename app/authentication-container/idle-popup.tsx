import * as React from 'react';
import { Popup } from '../shared/popup/popup';
import * as styles from './css/idle-popup.css';

interface IProps {
  idleEnd: () => any;
  isIdle: boolean;
}

export const IdlePopup: React.StatelessComponent<IProps> = props => {
  const { idleEnd, isIdle } = props;
  return (
    <Popup visible={isIdle}>
      <div>
        <div className={styles.idlePopupTitle}>Looks like you are idle</div>
        <div className={styles.idleSubheading}>
          Please click below to prevent from being automatically logged out
        </div>
        <div className={styles.idleButton} onClick={idleEnd}>
          Keep me logged in
        </div>
      </div>
    </Popup>
  );
};
