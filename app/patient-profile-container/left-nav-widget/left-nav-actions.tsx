import * as React from 'react';
import * as styles from './css/left-nav-actions.css';
import LeftNavAction from './left-nav-action';
import { Selected } from './left-nav-widget';

interface IProps {
  onClick: (selected: Selected) => void;
}

const LeftNavActions: React.StatelessComponent<IProps> = ({ onClick }) => {
  return (
    <div className={styles.container}>
      <LeftNavAction action="careTeam" onClick={onClick} />
      <LeftNavAction action="scratchPad" onClick={onClick} />
      <LeftNavAction action="message" onClick={onClick} />
      <LeftNavAction action="quickActions" onClick={onClick} />
    </div>
  );
};

export default LeftNavActions;
