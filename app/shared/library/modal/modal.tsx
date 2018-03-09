import * as React from 'react';
import { Popup } from '../../popup/popup';
import { Color as IconColor } from '../icon/icon';
import { IconName } from '../icon/icon-types';
import ModalButtons from '../modal-buttons/modal-buttons';
import ModalError from '../modal-error/modal-error';
import ModalHeader, { Color } from '../modal-header/modal-header';
import * as styles from './css/modal.css';

interface IProps {
  onClose: () => void;
  onSubmit: () => void;
  isVisible: boolean;
  titleMessageId?: string;
  subTitleMessageId?: string | null;
  cancelMessageId?: string;
  submitMessageId?: string;
  errorMessageId?: string;
  error?: string | null;
  children?: any;
  redSubmitButton?: boolean;
  headerColor?: Color;
  headerIconName?: IconName;
  headerIconColor?: IconColor;
  headerIconSize?: 'large' | 'extraLarge';
  className?: string;
}

const Modal: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    isVisible,
    titleMessageId,
    subTitleMessageId,
    cancelMessageId,
    submitMessageId,
    errorMessageId,
    error,
    onClose,
    onSubmit,
    children,
    redSubmitButton,
    headerColor,
    headerIconName,
    headerIconColor,
    headerIconSize,
    className,
  } = props;

  const errorComponent = error ? (
    <ModalError errorMessageId={errorMessageId} error={error} />
  ) : null;

  const popupClassName = className || styles.popup;

  return (
    <Popup visible={isVisible} closePopup={onClose} style="no-padding" className={popupClassName}>
      <ModalHeader
        titleMessageId={titleMessageId}
        bodyMessageId={subTitleMessageId}
        closePopup={onClose}
        color={headerColor}
        headerIconName={headerIconName}
        headerIconColor={headerIconColor}
        headerIconSize={headerIconSize}
      />
      {errorComponent}
      <div className={styles.body}>
        {children}
        <ModalButtons
          cancelMessageId={cancelMessageId}
          submitMessageId={submitMessageId}
          cancel={onClose}
          submit={onSubmit}
          redSubmit={redSubmitButton}
        />
      </div>
    </Popup>
  );
};

export default Modal;
