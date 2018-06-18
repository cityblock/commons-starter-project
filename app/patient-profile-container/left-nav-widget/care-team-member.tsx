import React from 'react';
import { FullCareTeamUserFragment } from '../../graphql/types';
import { formatCareTeamMemberRole, formatFullName } from '../../shared/helpers/format-helpers';
import Avatar from '../../shared/library/avatar/avatar';
import Icon from '../../shared/library/icon/icon';
import Text from '../../shared/library/text/text';
import CareTeamMemberContact from './care-team-member-contact';
import styles from './css/care-team-member.css';

interface IProps {
  careTeamMember: FullCareTeamUserFragment;
  handleClick: (careTeamMemberId: string) => void;
  isSelected: boolean;
  isLead: boolean;
}

const CareTeamMember: React.StatelessComponent<IProps> = (props: IProps) => {
  const { careTeamMember, handleClick, isLead, isSelected } = props;
  const { firstName, lastName } = careTeamMember;

  return (
    <div onClick={() => handleClick(careTeamMember.id)}>
      <div className={styles.container}>
        <div className={styles.user}>
          <Avatar size="large" src={careTeamMember.googleProfileImageUrl} />
          <div className={styles.detail}>
            <Text
              text={formatFullName(firstName, lastName)}
              isBold
              size="largest"
              color="black"
              className={styles.bottomMargin}
            />
            <Text
              text={formatCareTeamMemberRole(careTeamMember.userRole)}
              size="large"
              color="black"
            />
          </div>
        </div>
        {isLead && <Icon name="stars" color="blue" />}
      </div>
      <CareTeamMemberContact
        careTeamMemberId={careTeamMember.id}
        firstName={careTeamMember.firstName || 'Unknown'}
        email={careTeamMember.email || ''}
        isVisible={isSelected}
      />
      {!isSelected && <div className={styles.divider} />}
    </div>
  );
};

export default CareTeamMember;
