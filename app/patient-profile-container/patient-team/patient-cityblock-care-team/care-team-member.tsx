import * as React from 'react';
import { FullUserFragment } from '../../../graphql/types';
import { formatCareTeamMemberRole, formatFullName } from '../../../shared/helpers/format-helpers';
import Avatar from '../../../shared/library/avatar/avatar';
import HamburgerMenuOption from '../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../shared/library/hamburger-menu/hamburger-menu';
import SmallText from '../../../shared/library/small-text/small-text';
import * as styles from './css/care-team-member.css';

interface IProps {
  careTeamMember: FullUserFragment;
  onClickToRemove: (careTeamMemberToRemove: FullUserFragment) => void;
}

interface IState {
  isMenuOpen: boolean;
}

export class CareTeamMember extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { isMenuOpen: false };
  }

  onMenuToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    const { isMenuOpen } = this.state;

    this.setState({ isMenuOpen: !isMenuOpen });
  };

  onMakeTeamLead = () => {
    // TODO: implement this
    return true;
  };

  onRemoveFromTeam = () => {
    const { careTeamMember, onClickToRemove } = this.props;
    this.setState({ isMenuOpen: false });
    onClickToRemove(careTeamMember);
  };

  render() {
    const { careTeamMember } = this.props;
    const { isMenuOpen } = this.state;

    return (
      <div className={styles.careTeamMember}>
        <div className={styles.careTeamMemberData}>
          <div className={styles.careTeamMemberBasicInfo}>
            <Avatar size="large" src={careTeamMember.googleProfileImageUrl} />
            <div className={styles.careTeamMemberNameAndTitle}>
              <SmallText
                text={formatFullName(careTeamMember.firstName, careTeamMember.lastName)}
                color="black"
                size="largest"
                isBold={true}
              />
              <SmallText
                text={formatCareTeamMemberRole(careTeamMember.userRole)}
                color="gray"
                size="medium"
              />
            </div>
          </div>
          <div className={styles.careTeamMemberContactInfo}>
            <SmallText text={careTeamMember.phone || 'Unknown Phone'} color="black" size="medium" />
            <SmallText text={careTeamMember.email || 'Unknown Email'} color="black" size="medium" />
          </div>
        </div>
        <HamburgerMenu open={isMenuOpen} onMenuToggle={this.onMenuToggle}>
          <HamburgerMenuOption
            messageId="patientTeam.makeTeamLead"
            icon="star"
            onClick={this.onMakeTeamLead}
          />
          <HamburgerMenuOption
            messageId="patientTeam.removeFromTeam"
            icon="removeCircle"
            onClick={this.onRemoveFromTeam}
          />
        </HamburgerMenu>
      </div>
    );
  }
}

export default CareTeamMember;
