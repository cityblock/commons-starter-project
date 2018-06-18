import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../library/button/button';
import Icon from '../../library/icon/icon';
import ModalButtons from '../../library/modal-buttons/modal-buttons';
import styles from './css/delete-warning.css';

interface IProps {
  cancel: () => void; // for use when clicking cancel button
  deleteItem: () => void; // what to do when clicking delete
  titleMessageId: string;
  descriptionMessageId?: string;
  deletedItemHeaderMessageId?: string; // optional translate id for red header above item name
  deletedItemName?: string; // optional translate id for name of item to be deleted
  modal?: boolean; // changes button styles slightly if component in modal
}

const DeleteWarning: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    titleMessageId,
    descriptionMessageId,
    deletedItemHeaderMessageId,
    deletedItemName,
    cancel,
    deleteItem,
    modal,
  } = props;

  const buttons = modal ? (
    <ModalButtons
      cancel={cancel}
      submit={deleteItem}
      submitMessageId="modalButtons.delete"
      redSubmit={true}
    />
  ) : (
    <div className={styles.flex}>
      <Button
        onClick={cancel}
        messageId="modalButtons.cancel"
        className={styles.cancel}
        small={true}
        color="white"
      />
      <Button onClick={deleteItem} messageId="modalButtons.delete" small={true} color="red" />
    </div>
  );

  return (
    <div className={styles.container}>
      <Icon name="errorOutline" className={styles.warning} />
      <FormattedMessage id={titleMessageId}>
        {(message: string) => <h2>{message}</h2>}
      </FormattedMessage>
      {descriptionMessageId && (
        <FormattedMessage id={descriptionMessageId}>
          {(message: string) => <p>{message}</p>}
        </FormattedMessage>
      )}
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
      <div className={styles.buttons}>{buttons}</div>
    </div>
  );
};

export default DeleteWarning;
