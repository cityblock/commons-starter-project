import * as React from 'react';
import Button from '../button/button';
import * as styles from './css/modal-buttons.css';

interface IProps {
  cancelMessageId: string; // translate id for cancel (white left) button
  submitMessageId: string; // translate id for submit (blue right) button
  cancel: () => void; // click handler for cancel button
  submit: () => void; // click handler for submit button
}

const ModalButtons: React.StatelessComponent<IProps> = (props: IProps) => {
  const { cancelMessageId, submitMessageId, cancel, submit } = props;

  return (
    <div className={styles.flex}>
      <Button
        messageId={cancelMessageId}
        color="white"
        onClick={cancel}
        className={styles.button}
      />
      <Button messageId={submitMessageId} onClick={submit} className={styles.button} />
    </div>
  );
};

export default ModalButtons;
