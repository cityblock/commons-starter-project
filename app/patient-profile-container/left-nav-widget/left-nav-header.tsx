import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../shared/library/icon/icon';
import * as styles from './css/left-nav-header.css';
import { ActionIconsMapping } from './helpers';
import { Selected } from './left-nav-widget';

interface IProps {
  selected: Selected;
  onClose: () => void;
}

const LeftNavHeader: React.StatelessComponent<IProps> = (props: IProps) => {
  const { selected, onClose } = props;
  const iconName = ActionIconsMapping[selected];
  const messageId = `leftNavActions.${selected}`;

  return (
    <FormattedMessage id={messageId}>
      {(message: string) => (
        <button onClick={onClose} className={styles.button}>
          <div className={styles.flex}>
            <Icon name={iconName} color="white" className={styles.icon} />
            <h2>{message}</h2>
          </div>
          <Icon name="keyboardArrowDown" color="white" className={styles.icon} />
        </button>
      )}
    </FormattedMessage>
  );
};

export default LeftNavHeader;
