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
  isLoading?: boolean; // if true, disable submit button
  className?: string;
}

const ModalButtons: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    cancelMessageId,
    submitMessageId,
    cancel,
    submit,
    redSubmit,
    isLoading,
    className,
  } = props;
  const submitButtonMessageId = isLoading
    ? 'modalButtons.loading'
    : submitMessageId || 'modalButtons.submit';

  return (
    <div
      className={classNames(className, styles.flex, {
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
          messageId={submitButtonMessageId}
          color={redSubmit ? 'red' : 'blue'}
          onClick={submit}
          className={styles.button}
          disabled={!!isLoading}
        />
      )}
    </div>
  );
};

export default ModalButtons;
