import * as classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Button from '../shared/library/button/button';
import SmallText from '../shared/library/small-text/small-text';
import * as styles from './css/patient-intake-checklist-item.css';

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
        <SmallText messageId={labelId} color="black" size="large" isBold={true} />
        <SmallText messageId={subtextId} color="gray" size="medium" />
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
