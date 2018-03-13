import * as classNames from 'classnames';
import * as React from 'react';
import Icon from '../../shared/library/icon/icon';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/care-team-member-contact.css';

interface IProps {
  careTeamMemberId: string;
  firstName: string;
  isVisible: boolean;
}

const CareTeamMemberContact: React.StatelessComponent<IProps> = (props: IProps) => {
  const { firstName, isVisible } = props;

  const containerStyles = classNames(styles.container, {
    [styles.collapsed]: !isVisible,
    [styles.expanded]: isVisible,
  });

  return (
    <div className={containerStyles} onClick={e => e.stopPropagation()}>
      <div className={styles.flex}>
        <Icon name="phone" color="black" className={styles.icon} />
        <SmallText
          messageId="careTeam.call"
          messageValues={{ name: firstName }}
          color="black"
          size="medium"
        />
      </div>
      <div className={styles.flex}>
        <Icon name="slackFull" className={styles.icon} />
        <SmallText
          messageId="careTeam.slack"
          messageValues={{ name: firstName }}
          color="black"
          size="medium"
        />
      </div>
    </div>
  );
};

export default CareTeamMemberContact;
