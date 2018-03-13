import * as React from 'react';
import { FullUserFragment } from '../../graphql/types';
import { formatCareTeamMemberRole, formatFullName } from '../../shared/helpers/format-helpers';
import Avatar from '../../shared/library/avatar/avatar';
import Icon from '../../shared/library/icon/icon';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/care-team-member.css';

interface IProps {
  careTeamMember: FullUserFragment;
  handleClick: (careTeamMemberId: string) => void;
  isSelected: boolean;
  isLead: boolean;
}

const CareTeamMember: React.StatelessComponent<IProps> = (props: IProps) => {
  const { careTeamMember, handleClick, isLead } = props;
  const { firstName, lastName } = careTeamMember;

  return (
    <div onClick={() => handleClick(careTeamMember.id)}>
      <div className={styles.container}>
        <div className={styles.user}>
          <Avatar size="large" src={careTeamMember.googleProfileImageUrl} />
          <div className={styles.detail}>
            <SmallText
              text={formatFullName(firstName, lastName)}
              isBold
              size="largest"
              color="black"
              className={styles.bottomMargin}
            />
            <SmallText
              text={formatCareTeamMemberRole(careTeamMember.userRole)}
              size="large"
              color="black"
            />
          </div>
        </div>
        {isLead && <Icon name="stars" color="blue" />}
      </div>
      <div className={styles.divider} />
    </div>
  );
};

export default CareTeamMember;
