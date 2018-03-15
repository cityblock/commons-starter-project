import * as React from 'react';
import Icon from '../../../shared/library/icon/icon';
import SmallText from '../../../shared/library/small-text/small-text';
import { Selected } from '../left-nav';
import * as styles from './css/header.css';

interface IProps {
  isOpen: boolean;
  selected: Selected;
  onClick: (clicked: Selected) => void;
}

const InfoGroupHeader: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOpen, selected, onClick } = props;

  const messageId = `patientInfo.${selected}`;
  const iconName = isOpen ? 'keyboardArrowUp' : 'keyboardArrowDown';

  return (
    <button className={styles.container} onClick={() => onClick(selected)}>
      <SmallText messageId={messageId} size="largest" color="black" font="basetica" isBold />
      <Icon name={iconName} color="black" />
    </button>
  );
};

export default InfoGroupHeader;
