import * as React from 'react';
import * as styles from './css/container.css';

const ITEM_HEIGHT = 36;

interface IProps {
  isOpen: boolean;
  children?: any; // use InfoGroupItem component in same folder
}

const InfoGroupContainer: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOpen, children } = props;
  // calculate height for transition purposes
  const height = isOpen ? `${children.length * ITEM_HEIGHT + 22}px` : '0';

  return (
    <div className={styles.container} style={{ height }}>
      <div className={styles.padding}>{children}</div>
    </div>
  );
};

export default InfoGroupContainer;
