import * as React from 'react';
import Icon from '../../../shared/library/icon/icon';
import SmallText from '../../../shared/library/small-text/small-text';
import { Selected } from '../left-nav';
import * as styles from './css/header.css';

interface IProps {
  isOpen: boolean;
  selected: Selected;
  onClick: (clicked: Selected) => void;
  itemCount?: number; // if passed, shows count of items
}

const InfoGroupHeader: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOpen, selected, onClick, itemCount } = props;

  const messageId = `patientInfo.${selected}`;
  const iconName = isOpen ? 'keyboardArrowUp' : 'keyboardArrowDown';

  return (
    <button className={styles.container} onClick={() => onClick(selected)}>
      <div>
        <SmallText messageId={messageId} size="largest" color="black" font="basetica" isBold />
        {itemCount && (
          <SmallText
            text={`(${itemCount})`}
            size="largest"
            color="lightBlue"
            font="basetica"
            isBold
            className={styles.headerText}
          />
        )}
      </div>
      <Icon name={iconName} color="black" />
    </button>
  );
};

export default InfoGroupHeader;
