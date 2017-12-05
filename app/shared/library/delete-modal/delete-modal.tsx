import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../library/icon/icon';
import { Popup } from '../../popup/popup';
import ModalButtons from '../modal-buttons/modal-buttons';
import * as styles from './css/delete-modal.css';

interface IProps {
  visible: boolean;
  closePopup: () => void; // for use when clicking cancel and X icon
  deleteItem: () => void; // what to do when clicking delete
  titleMessageId: string;
  descriptionMessageId: string;
  deletedItemHeaderMessageId?: string; // optional translate id for red header above item name
  deletedItemName?: string; // optional translate id for name of item to be deleted
}

const DeleteModal: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    visible,
    titleMessageId,
    descriptionMessageId,
    deletedItemHeaderMessageId,
    deletedItemName,
    closePopup,
    deleteItem,
  } = props;

  return (
    <Popup visible={visible} closePopup={closePopup} style="no-padding" className={styles.popup}>
      <div className={styles.container}>
        <Icon name="close" onClick={closePopup} className={styles.close} />
        <div className={styles.body}>
          <Icon name="errorOutline" className={styles.warning} />
          <FormattedMessage id={titleMessageId}>
            {(message: string) => <h2>{message}</h2>}
          </FormattedMessage>
          <FormattedMessage id={descriptionMessageId}>
            {(message: string) => <p>{message}</p>}
          </FormattedMessage>
          {deletedItemName && (
            <div className={styles.deletedItemDetail}>
              {deletedItemHeaderMessageId && (
                <FormattedMessage id={deletedItemHeaderMessageId}>
                  {(message: string) => <h3>{message}</h3>}
                </FormattedMessage>
              )}
              <h4>{deletedItemName}</h4>
            </div>
          )}
          <div className={styles.buttons}>
            <ModalButtons
              cancel={closePopup}
              submit={deleteItem}
              submitMessageId="modalButtons.delete"
              redSubmit={true}
            />
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default DeleteModal;
