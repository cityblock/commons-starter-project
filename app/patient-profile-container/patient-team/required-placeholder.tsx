import * as React from 'react';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/required-placeholder.css';

interface IProps {
  headerMessageId: string;
  subtextMessageId: string;
  onClick: () => void;
}

const RequiredPlaceholder: React.StatelessComponent<IProps> = (props: IProps) => {
  const { onClick, headerMessageId, subtextMessageId } = props;

  return (
    <div className={styles.requiredTeamMember} onClick={onClick}>
      <SmallText messageId={headerMessageId} color="red" size="medium" className={styles.header} />
      <SmallText messageId={subtextMessageId} size="medium" />
    </div>
  );
};

export default RequiredPlaceholder;
