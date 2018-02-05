import * as classNames from 'classnames';
import * as React from 'react';
import Icon from '../icon/icon';
import * as styles from './css/avatar.css';

type Size = 'small' | 'medium' | 'large' | 'xLarge' | 'xxLarge'; // 20x20, 30x30, 40x40, 80x80, 120x120 default is medium
type BorderColor = 'gray' | 'lightGray' | 'white'; // default is gray
type AvatarType = 'patient' | 'user'; // ddefault is user

interface IProps {
  src?: string | null; // image url, uses default avatar if not provided
  size?: Size;
  borderColor?: BorderColor;
  avatarType?: AvatarType;
  className?: string; // optional other styles, use largely for margin/padding
}

const Avatar: React.StatelessComponent<IProps> = (props: IProps) => {
  const { src, size, borderColor, className, avatarType } = props;

  const avatarStyles = classNames(
    styles.avatar,
    {
      [styles.small]: size && size === 'small',
      [styles.large]: size && size === 'large',
      [styles.xLarge]: size && size === 'xLarge',
      [styles.xxLarge]: size && size === 'xxLarge',
      [styles.lightGrayBorder]: borderColor && borderColor === 'lightGray',
      [styles.whiteBorder]: borderColor && borderColor === 'white',
    },
    className,
  );

  if (src) {
    return <img src={src} className={avatarStyles} alt="avatar photo" />;
  } else if (avatarType === 'patient') {
    return <Icon name="accountBox" className={avatarStyles} />;
  } else {
    return <Icon name="accountCircle" className={avatarStyles} />;
  }
};

export default Avatar;
