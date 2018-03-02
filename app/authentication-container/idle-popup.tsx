import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../shared/library/icon/icon';
import ModalButtons from '../shared/library/modal-buttons/modal-buttons';
import { Popup } from '../shared/popup/popup';
import * as styles from './css/idle-popup.css';

interface IProps {
  idleEnd: () => void;
  logout: () => void;
  isIdle: boolean;
}

export const IdlePopup: React.StatelessComponent<IProps> = props => {
  const { idleEnd, isIdle, logout } = props;
  return (
    <Popup visible={isIdle}>
      <div>
        <Icon color="red" name="alarm" className={styles.icon} />
        <FormattedMessage id="idlePopup.heading">
          {(message: string) => <div className={styles.heading}>{message}</div>}
        </FormattedMessage>
        <FormattedMessage id="idlePopup.body">
          {(message: string) => <div className={styles.body}>{message}</div>}
        </FormattedMessage>
        <ModalButtons
          cancel={logout}
          submit={idleEnd}
          cancelMessageId="idlePopup.cancel"
          submitMessageId="idlePopup.stayLoggedIn"
        />
      </div>
    </Popup>
  );
};
