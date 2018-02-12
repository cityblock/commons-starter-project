import * as classNames from 'classnames';
import * as React from 'react';
import Button from '../button/button';
import * as styles from './css/modal-buttons.css';

interface IProps {
  cancelMessageId?: string; // translate id for cancel (white left) button, default = 'Cancel'
  submitMessageId?: string; // translate id for submit (blue right) button, default = 'Submit'
  cancel?: () => void; // click handler for cancel button
  submit?: () => void; // click handler for submit button
  redSubmit?: boolean; // if true, makes submit button red
}

const ModalButtons: React.StatelessComponent<IProps> = (props: IProps) => {
  const { cancelMessageId, submitMessageId, cancel, submit, redSubmit } = props;

  return (
    <div
      className={classNames(styles.flex, {
        [styles.single]: !(cancel && submit),
      })}
    >
      {cancel && (
        <Button
          messageId={cancelMessageId || 'modalButtons.cancel'}
          color="white"
          onClick={cancel}
          className={styles.button}
        />
      )}
      {submit && (
        <Button
          messageId={submitMessageId || 'modalButtons.submit'}
          color={redSubmit ? 'red' : 'blue'}
          onClick={submit}
          className={styles.button}
        />
      )}
    </div>
  );
};

export default ModalButtons;
