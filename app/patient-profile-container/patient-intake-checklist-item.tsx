import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../shared/library/button/button';
import Text from '../shared/library/text/text';
import styles from './css/patient-intake-checklist-item.css';

export interface IProps {
  isCompleted: boolean;
  labelId: string;
  subtextId: string;
  buttonTextId: string;
  buttonLink: string;
  onClick: () => any;
}

const PatientIntakeChecklistItem: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isCompleted, labelId, subtextId, buttonTextId, buttonLink, onClick } = props;

  const buttonColor = isCompleted ? 'gray' : 'white';
  const buttonIconName = isCompleted ? 'checkCircle' : null;
  const checklistItemStyles = classNames(styles.checklistItem, {
    [styles.completed]: isCompleted,
  });
  const buttonMessageId = isCompleted ? 'patientIntakeChecklist.completed' : buttonTextId;

  return (
    <div className={checklistItemStyles}>
      <div className={styles.checklistItemText}>
        <Text messageId={labelId} color="black" size="large" isBold={true} />
        <Text messageId={subtextId} color="gray" size="medium" />
      </div>
      <div className={styles.checklistItemButton}>
        <Link to={buttonLink} onClick={onClick}>
          <Button
            messageId={buttonMessageId}
            color={buttonColor}
            icon={buttonIconName}
            onClick={onClick}
          />
        </Link>
      </div>
    </div>
  );
};

export default PatientIntakeChecklistItem;
