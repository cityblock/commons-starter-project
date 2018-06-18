import classNames from 'classnames';
import React from 'react';
import styles from './popup.css';

interface IProps {
  style?: 'no-padding' | 'small-padding';
  backgroundStyle?: 'default' | 'clear';
  alignContent?: 'center' | 'bottom';
  visible: boolean;
  children: any;
  closePopup?: () => void;
  className?: string;
}

export const Popup: React.StatelessComponent<IProps> = props => {
  // Eventually there will be a transition here...
  const { style, closePopup, className, alignContent, backgroundStyle } = props;

  const contentStyles = classNames(
    styles.content,
    {
      [styles.smallContentPadding]: style === 'small-padding',
      [styles.noContentPadding]: style === 'no-padding',
    },
    className,
  );

  const backgroundStyles = classNames(styles.background, {
    [styles.bottom]: alignContent === 'bottom',
    [styles.transparent]: backgroundStyle === 'clear',
  });

  // prevent popup from closing if clicking on content
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (props.visible) {
    return (
      <div className={backgroundStyles} onClick={closePopup}>
        <div className={contentStyles} onClick={stopPropagation}>
          {props.children}
        </div>
      </div>
    );
  }
  return null;
};
