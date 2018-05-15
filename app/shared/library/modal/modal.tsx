import * as classNames from 'classnames';
import * as React from 'react';
import { Popup } from '../../popup/popup';
import { Color as IconColor } from '../icon/icon';
import { IconName } from '../icon/icon-types';
import ModalButtons from '../modal-buttons/modal-buttons';
import ModalError from '../modal-error/modal-error';
import ModalHeader, { Color } from '../modal-header/modal-header';
import Spinner from '../spinner/spinner';
import * as styles from './css/modal.css';

interface IProps {
  onClose?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  isVisible: boolean;
  isButtonHidden?: boolean;
  titleMessageId?: string;
  titleText?: string;
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
  headerClassName?: string;
  isLoading?: boolean;
}

const Modal: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    isVisible,
    isButtonHidden,
    titleMessageId,
    titleText,
    subTitleMessageId,
    cancelMessageId,
    submitMessageId,
    errorMessageId,
    error,
    onCancel,
    onClose,
    onSubmit,
    children,
    redSubmitButton,
    headerColor,
    headerIconName,
    headerIconColor,
    headerIconSize,
    className,
    headerClassName,
    isLoading,
  } = props;

  const popupClassName = className || styles.popup;
  const bodyContent = isLoading ? <Spinner className={styles.spinner} /> : children;
  const bodyHtml = bodyContent ? <div className={styles.body}>{bodyContent}</div> : null;

  const errorComponent = error ? (
    <ModalError errorMessageId={errorMessageId} error={error} />
  ) : null;

  const buttonClassName = classNames(styles.buttons, { [styles.buttonsNoBody]: !bodyContent });

  const buttonComponent = !isButtonHidden ? (
    <ModalButtons
      cancelMessageId={cancelMessageId}
      submitMessageId={submitMessageId}
      cancel={onCancel || onClose}
      submit={onSubmit}
      redSubmit={redSubmitButton}
      isLoading={isLoading}
      className={buttonClassName}
    />
  ) : null;

  const headerClassNames = classNames(headerClassName, styles.header, {
    [styles.headerNoBody]: !bodyContent,
  });
  return (
    <Popup visible={isVisible} closePopup={onClose} style="no-padding" className={popupClassName}>
      <ModalHeader
        titleMessageId={titleMessageId}
        titleText={titleText}
        bodyMessageId={subTitleMessageId}
        closePopup={onClose}
        color={headerColor}
        headerIconName={headerIconName}
        headerIconColor={headerIconColor}
        headerIconSize={headerIconSize}
        className={headerClassNames}
      />
      {errorComponent}
      {bodyHtml}
      {buttonComponent}
    </Popup>
  );
};

export default Modal;
