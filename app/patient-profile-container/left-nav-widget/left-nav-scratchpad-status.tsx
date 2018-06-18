import React from 'react';
import Icon from '../../shared/library/icon/icon';
import Text from '../../shared/library/text/text';
import styles from './css/left-nav-scratchpad-status.css';
import { MAX_SCRATCHPAD_LENGTH } from './left-nav-scratchpad';

interface IProps {
  charCount: number;
  saveSuccess: boolean;
  saveError: boolean;
  resaveScratchPad: () => void;
}

const LeftNavScratchPadStatus: React.StatelessComponent<IProps> = (props: IProps) => {
  const { charCount, saveSuccess, saveError, resaveScratchPad } = props;

  const charCountString = `${charCount}/${MAX_SCRATCHPAD_LENGTH}`;

  if (charCount >= MAX_SCRATCHPAD_LENGTH) {
    return (
      <div className={styles.container}>
        <div className={styles.flex}>
          <Icon name="error" color="red" className={styles.icon} />
          <Text messageId="scratchPad.maxChars" color="red" />
        </div>
        <Text text={charCountString} color="red" />
      </div>
    );
  }

  let saveNote: JSX.Element = <div />;

  if (saveSuccess) {
    saveNote = (
      <div className={styles.flex}>
        <Icon name="checkCircle" color="blue" className={styles.icon} />
        <Text messageId="scratchPad.saveSuccess" color="gray" />
      </div>
    );
  } else if (saveError) {
    saveNote = (
      <div className={styles.flex} onClick={resaveScratchPad}>
        <Icon name="error" color="red" className={styles.icon} />
        <Text messageId="scratchPad.saveError" color="red" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {saveNote}
      <Text text={charCountString} color="gray" />
    </div>
  );
};

export default LeftNavScratchPadStatus;
