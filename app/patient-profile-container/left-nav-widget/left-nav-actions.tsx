import React from 'react';
import { Selected } from '../../reducers/patient-left-nav-reducer';
import styles from './css/left-nav-actions.css';
import LeftNavAction from './left-nav-action';

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
