import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './popup.css';

interface IProps {
  style?: 'no-padding' | 'small-padding';
  visible: boolean;
  children: any;
  closePopup?: () => void;
  className?: string;
}

export const Popup: React.StatelessComponent<IProps> = props => {
  // Eventually there will be a transition here...
  const { style, closePopup, className } = props;

  const contentStyles = classNames(
    styles.content,
    {
      [styles.smallContentPadding]: style === 'small-padding',
      [styles.noContentPadding]: style === 'no-padding',
    },
    className,
  );

  // prevent popup from closing if clicking on content
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (props.visible) {
    return (
      <div className={styles.background} onClick={closePopup}>
        <div className={contentStyles} onClick={stopPropagation}>
          {props.children}
        </div>
      </div>
    );
  }
  return null;
};
