import * as React from 'react';
import { Popup } from '../../popup/popup';
import ModalButtons from '../modal-buttons/modal-buttons';
import ModalError from '../modal-error/modal-error';
import ModalHeader from '../modal-header/modal-header';
import * as styles from './css/modal.css';

interface IProps {
  onClose: () => void;
  onSubmit: () => void;
  isVisible: boolean;
  titleMessageId?: string;
  cancelMessageId?: string;
  submitMessageId?: string;
  errorMessageId?: string;
  error?: string | null;
  children?: any;
}

const Modal: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    isVisible,
    titleMessageId,
    cancelMessageId,
    submitMessageId,
    errorMessageId,
    error,
    onClose,
    onSubmit,
    children,
  } = props;

  const errorComponent = error ? (
    <ModalError errorMessageId={errorMessageId} error={error} />
  ) : null;

  return (
    <Popup visible={isVisible} closePopup={onClose} style="no-padding">
      <ModalHeader titleMessageId={titleMessageId} closePopup={onClose} />
      {errorComponent}
      <div className={styles.body}>
        {children}
        <ModalButtons
          cancelMessageId={cancelMessageId}
          submitMessageId={submitMessageId}
          cancel={onClose}
          submit={onSubmit}
        />
      </div>
    </Popup>
  );
};

export default Modal;
