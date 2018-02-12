import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../library/icon/icon';
import * as styles from './css/modal-header.css';

type Color = 'gray' | 'navy' | 'white';

interface IProps {
  titleMessageId?: string; // modal title translate id
  bodyMessageId?: string; // description under title translate id
  color?: Color; // optional color, defaults to gray
  closePopup?: () => void; // optional handler, will render X to close
  children?: any;
}

const ModalHeader: React.StatelessComponent<IProps> = (props: IProps) => {
  const { titleMessageId, bodyMessageId, color, closePopup, children } = props;
  const navy = color === 'navy';
  const white = color === 'white';
  const containerStyles = classNames(styles.container, {
    [styles.navyContainer]: navy,
    [styles.whiteContainer]: white,
  });
  const iconStyles = classNames(styles.icon, {
    [styles.navyIcon]: navy,
  });

  const title = titleMessageId ? (
    <FormattedMessage id={titleMessageId}>
      {(message: string) => <h2>{message}</h2>}
    </FormattedMessage>
  ) : null;

  const body = bodyMessageId ? (
    <FormattedMessage id={bodyMessageId}>{(message: string) => <p>{message}</p>}</FormattedMessage>
  ) : null;

  return (
    <div className={containerStyles}>
      {title}
      {body}
      {children}
      {closePopup && <Icon name="close" onClick={closePopup} className={iconStyles} />}
    </div>
  );
};

export default ModalHeader;
