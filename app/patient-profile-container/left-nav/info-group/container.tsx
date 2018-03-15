import * as React from 'react';
import * as styles from './css/container.css';

const ITEM_HEIGHT = 36;

interface IProps {
  isOpen: boolean;
  children?: any; // use InfoGroupItem component in same folder
}

const InfoGroupContainer: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOpen, children } = props;
  let nonNullChildrenCount: number = 0;

  // if only one child, the count is 1 as long as child as truthy
  if (React.isValidElement(children)) {
    nonNullChildrenCount = children ? 1 : 0;
    // otherwise count number of non-null children in array
  } else {
    nonNullChildrenCount = children.filter((child: JSX.Element | null) => !!child).length;
  }

  // calculate height for transition purposes
  const height = isOpen ? `${nonNullChildrenCount * ITEM_HEIGHT + 22}px` : '0';

  return (
    <div className={styles.container} style={{ height }}>
      <div className={styles.padding}>{children}</div>
    </div>
  );
};

export default InfoGroupContainer;
