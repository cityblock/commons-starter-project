import * as classNames from 'classnames';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import * as styles from './css/task.css';

export interface IProps {
  taskId: string;
  patientId: string;
  visible: boolean;
  onCopy: () => any;
  onClickAddAttachment: () => any;
  onClickDelete: () => any;
}

export const TaskHamburgerMenu: React.StatelessComponent<IProps> = props => {
  const { visible, onClickAddAttachment, onClickDelete, patientId, taskId, onCopy } = props;

  const menuStyles = classNames(styles.hamburgerMenu, {
    [styles.visible]: visible,
  });

  const url = `${window.location.origin}/patients/${patientId}/tasks/${taskId}`;

  return (
    <div className={menuStyles}>
      <CopyToClipboard text={url} onCopy={onCopy}>
        <div className={styles.menuRow}>
          <div className={styles.shareIcon} />
          <div className={styles.menuLabel}>Share task URL</div>
        </div>
      </CopyToClipboard>
      <div className={styles.menuRow} onClick={onClickAddAttachment}>
        <div className={styles.paperclipIcon} />
        <div className={styles.menuLabel}>Add attachment</div>
      </div>
      <div className={styles.menuRow} onClick={onClickDelete}>
        <div className={styles.trashIcon} />
        <div className={styles.menuLabel}>Delete task</div>
      </div>
    </div>
  );
};
