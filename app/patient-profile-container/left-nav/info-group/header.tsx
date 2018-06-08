import * as React from 'react';
import Icon from '../../../shared/library/icon/icon';
import Text from '../../../shared/library/text/text';
import { Accordion } from '../left-nav';
import * as styles from './css/header.css';

interface IProps {
  isOpen: boolean;
  selected: Accordion;
  onClick: (clicked: Accordion) => void;
  itemCount?: number | null; // if passed, shows count of items
}

const InfoGroupHeader: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOpen, selected, onClick, itemCount } = props;

  const messageId = `patientInfo.${selected}`;
  const iconName = isOpen ? 'keyboardArrowUp' : 'keyboardArrowDown';

  return (
    <button className={styles.container} onClick={() => onClick(selected)}>
      <div>
        <Text messageId={messageId} size="largest" color="black" font="basetica" isBold />
        {itemCount && (
          <Text
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
