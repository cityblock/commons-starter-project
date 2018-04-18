import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon, { Color as IconColor } from '../../library/icon/icon';
import { IconName } from '../../library/icon/icon-types';
import * as styles from './css/modal-header.css';

export type Color = 'gray' | 'navy' | 'white';

interface IProps {
  titleMessageId?: string; // modal title translate id
  titleText?: string | null;
  bodyMessageId?: string | null; // description under title translate id
  bodyText?: string | null;
  color?: Color; // optional color, defaults to gray
  closePopup?: () => void; // optional handler, will render X to close
  children?: any;
  headerIconName?: IconName;
  headerIconColor?: IconColor;
  headerIconSize?: 'large' | 'extraLarge';
  className?: string;
}

const ModalHeader: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    titleMessageId,
    bodyMessageId,
    color,
    closePopup,
    children,
    titleText,
    bodyText,
    headerIconName,
    headerIconColor,
    headerIconSize,
    className,
  } = props;
  const navy = color === 'navy';
  const white = color === 'white';
  const containerStyles = classNames(styles.container, className, {
    [styles.navyContainer]: navy,
    [styles.whiteContainer]: white,
  });
  const iconStyles = classNames(styles.icon, {
    [styles.navyIcon]: navy,
  });
  const isHeaderIconLarge = headerIconSize === 'large';
  const isHeaderIconExtraLarge = headerIconSize === 'extraLarge';

  const title = titleMessageId ? (
    <FormattedMessage id={titleMessageId}>
      {(message: string) => <h2>{message}</h2>}
    </FormattedMessage>
  ) : (
    <h2>{titleText}</h2>
  );

  const body = bodyMessageId ? (
    <FormattedMessage id={bodyMessageId}>{(message: string) => <p>{message}</p>}</FormattedMessage>
  ) : (
    <p>{bodyText}</p>
  );

  return (
    <div className={containerStyles}>
      {headerIconName && (
        <Icon
          name={headerIconName}
          color={headerIconColor}
          isLarge={isHeaderIconLarge}
          isExtraLarge={isHeaderIconExtraLarge}
        />
      )}
      {title}
      {(!!bodyMessageId || !!bodyText) && body}
      {children}
      {closePopup && <Icon name="close" onClick={closePopup} className={iconStyles} />}
    </div>
  );
};

export default ModalHeader;
