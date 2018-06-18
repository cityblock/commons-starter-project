import React from 'react';
import ErrorComponent from '../../error-component/error-component';
import { Popup } from '../../popup/popup';
import DeleteWarning from '../delete-warning/delete-warning';
import Icon from '../icon/icon';
import styles from './css/delete-modal.css';

interface IProps {
  visible: boolean;
  closePopup: () => void; // for use when clicking cancel and X icon
  deleteItem: () => void; // what to do when clicking delete
  titleMessageId: string;
  descriptionMessageId: string;
  deletedItemHeaderMessageId?: string; // optional translate id for red header above item name
  deletedItemName?: string; // optional translate id for name of item to be deleted
  error?: string | null;
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
    error,
  } = props;

  const body = error ? (
    <ErrorComponent errorMessage={error} />
  ) : (
    <DeleteWarning
      cancel={closePopup}
      deleteItem={deleteItem}
      titleMessageId={titleMessageId}
      descriptionMessageId={descriptionMessageId}
      deletedItemName={deletedItemName}
      deletedItemHeaderMessageId={deletedItemHeaderMessageId}
      modal={true}
    />
  );

  return (
    <Popup visible={visible} closePopup={closePopup} style="no-padding" className={styles.popup}>
      <div className={styles.container}>
        <Icon name="close" onClick={closePopup} className={styles.close} />
        {body}
      </div>
    </Popup>
  );
};

export default DeleteModal;
