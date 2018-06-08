import * as React from 'react';
import Text from '../shared/library/text/text';
import * as styles from './css/required-placeholder.css';

interface IProps {
  headerMessageId: string;
  subtextMessageId?: string;
  onClick: () => void;
}

const RequiredPlaceholder: React.StatelessComponent<IProps> = (props: IProps) => {
  const { onClick, headerMessageId, subtextMessageId } = props;
  const subtextHtml = subtextMessageId ? <Text messageId={subtextMessageId} size="medium" /> : null;

  return (
    <div className={styles.requiredTeamMember} onClick={onClick}>
      <Text messageId={headerMessageId} color="red" size="medium" className={styles.header} />
      {subtextHtml}
    </div>
  );
};

export default RequiredPlaceholder;
