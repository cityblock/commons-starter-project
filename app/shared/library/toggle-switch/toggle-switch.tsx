import * as classNames from 'classnames';
import * as React from 'react';
import Icon from '../icon/icon';
import * as styles from './css/toggle-switch.css';

interface IProps {
  isOn: boolean;
  onClick: () => void;
}

const ToggleSwitch: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOn, onClick } = props;

  const backgroundStyles = classNames(styles.background, {
    [styles.backgroundOn]: isOn,
  });
  const toggleStyles = classNames(styles.toggle, {
    [styles.toggleOn]: isOn,
  });
  const iconName = isOn ? 'work' : 'beachAccess';

  return (
    <div className={backgroundStyles} onClick={onClick}>
      <div className={toggleStyles}>
        <Icon name={iconName} color="darkGray" className={styles.icon} />
      </div>
    </div>
  );
};

export default ToggleSwitch;
