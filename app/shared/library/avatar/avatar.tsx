import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/avatar.css';

export const DEFAULT_AVATAR_URL = 'https://bit.ly/2weRwJm';

type Size = 'small' | 'medium' | 'large'; // 20x20, 30x30, 40x40, default is medium
type BorderColor = 'gray' | 'lightGray' | 'white'; // default is gray

interface IProps {
  src?: string; // image url, uses default avatar if not provided
  size?: Size;
  borderColor?: BorderColor;
  className?: string; // optional other styles, use largely for margin/padding
}

const Avatar: React.StatelessComponent<IProps> = (props: IProps) => {
  const { src, size, borderColor, className } = props;
  const avatarStyles = classNames(
    styles.avatar,
    {
      [styles.small]: size && size === 'small',
      [styles.large]: size && size === 'large',
      [styles.lightGrayBorder]: borderColor && borderColor === 'lightGray',
      [styles.whiteBorder]: borderColor && borderColor === 'white',
    },
    className,
  );

  return <img src={src || DEFAULT_AVATAR_URL} className={avatarStyles} alt="avatar photo" />;
};

export default Avatar;
