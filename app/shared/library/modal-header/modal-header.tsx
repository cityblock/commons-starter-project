import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../library/icon/icon';
import * as styles from './css/modal-header.css';

type Color = 'gray' | 'navy';

interface IProps {
  titleMessageId: string; // modal title translate id
  bodyMessageId: string; // description under title translate id
  color?: Color; // optional color, defaults to gray
  closePopup?: () => void; // optional handler, will render X to close
}

const ModalHeader: React.StatelessComponent<IProps> = (props: IProps) => {
  const { titleMessageId, bodyMessageId, color, closePopup } = props;
  const navy = color === 'navy';
  const textStyles = navy ? styles.navyText : '';
  const iconStyles = classNames(styles.icon, {
    [styles.navyIcon]: navy,
  });

  const title = (
    <FormattedMessage id={titleMessageId}>
      {(message: string) => <h2 className={textStyles}>{message}</h2>}
    </FormattedMessage>
  );

  const body = (
    <FormattedMessage id={bodyMessageId}>
      {(message: string) => <p className={textStyles}>{message}</p>}
    </FormattedMessage>
  );

  return (
    <div className={styles.container}>
      {title}
      {body}
      {closePopup && <Icon name="close" onClick={closePopup} className={iconStyles} />}
    </div>
  );
};

export default ModalHeader;
