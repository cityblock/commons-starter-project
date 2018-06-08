import * as React from 'react';
import Icon from '../shared/library/icon/icon';
import { IconName } from '../shared/library/icon/icon-types';
import Text from '../shared/library/text/text';
import * as styles from './css/progress-note-worry-score.css';

interface IProps {
  worryScore: number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IChoiceProps extends IProps {
  id: string;
  value: number;
  icon: IconName;
  iconColor: 'red' | 'yellow' | 'green';
}

export const WorryScoreChoice: React.StatelessComponent<IChoiceProps> = (props: IChoiceProps) => {
  const { worryScore, onChange, id, value, icon, iconColor } = props;
  const color = !worryScore || worryScore === value ? iconColor : 'gray';

  return (
    <div>
      <input
        className={styles.radio}
        name="worryScore"
        type="radio"
        id={id}
        value={value}
        checked={worryScore === value}
        onChange={onChange}
      />
      <label htmlFor={id} className={styles.label}>
        <Icon name={icon} color={color} className={styles.icon} />
      </label>
    </div>
  );
};

const ProgressNoteWorryScore: React.StatelessComponent<IProps> = (props: IProps) => {
  const { worryScore, onChange } = props;

  return (
    <div className={styles.container}>
      <Text
        messageId="progressNote.worryScore"
        isBold
        font="basetica"
        color="black"
        size="largest"
        className={styles.text}
      />
      <div className={styles.options}>
        <WorryScoreChoice
          worryScore={worryScore}
          id="worried"
          value={3}
          icon="sentimentDissatisfied"
          iconColor="red"
          onChange={onChange}
        />
        <WorryScoreChoice
          worryScore={worryScore}
          id="neutral"
          value={2}
          icon="sentimentNeutral"
          iconColor="yellow"
          onChange={onChange}
        />
        <WorryScoreChoice
          worryScore={worryScore}
          id="not-worried"
          value={1}
          icon="sentimentSatisfied"
          iconColor="green"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default ProgressNoteWorryScore;
