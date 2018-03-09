import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/left-nav-open.css';
import LeftNavHeader from './left-nav-header';
import { Selected } from './left-nav-widget';

interface IProps {
  patientId: string;
  isOpen: boolean;
  selected: Selected | null;
  onClose: () => void;
}

const LeftNavOpen: React.StatelessComponent<IProps> = (props: IProps) => {
  const { selected, isOpen, onClose } = props;

  const containerStyles = classNames(styles.container, {
    [styles.expanded]: isOpen,
    [styles.collapsed]: !isOpen,
  });

  return (
    <div className={containerStyles}>
      {selected && <LeftNavHeader selected={selected} onClose={onClose} />}
    </div>
  );
};

export default LeftNavOpen;
