import * as React from 'react';
import Icon from '../../shared/library/icon/icon';
import * as styles from './css/left-nav-action.css';
import { ActionIconsMapping } from './helpers';
import { Selected } from './left-nav-widget';

interface IProps {
  action: Selected;
  onClick: (action: Selected) => void;
}

const LeftNavAction: React.StatelessComponent<IProps> = (props: IProps) => {
  const { action, onClick } = props;
  const iconName = ActionIconsMapping[action];

  return (
    <button onClick={() => onClick(action)} className={styles.button}>
      <Icon name={iconName} color="white" className={styles.icon} />
    </button>
  );
};

export default LeftNavAction;
