import classNames from 'classnames';
import React from 'react';
import { graphql } from 'react-apollo';
import careTeamMakeTeamLeadGraphql from '../../../graphql/queries/care-team-make-team-lead-mutation.graphql';
import patientCareTeamGraphql from '../../../graphql/queries/get-patient-care-team.graphql';
import {
  careTeamMakeTeamLead,
  careTeamMakeTeamLeadVariables,
  FullCareTeamUser,
} from '../../../graphql/types';
import {
  formatCareTeamMemberRole,
  formatFullName,
  formatPhoneNumber,
} from '../../../shared/helpers/format-helpers';
import Avatar from '../../../shared/library/avatar/avatar';
import HamburgerMenuOption from '../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../shared/library/hamburger-menu/hamburger-menu';
import Icon from '../../../shared/library/icon/icon';
import Text from '../../../shared/library/text/text';
import styles from '../css/team-member.css';

interface IProps {
  careTeamMember: FullCareTeamUser;
  patientId: string;
  onClickToRemove: (careTeamMemberToRemove: FullCareTeamUser) => void;
}

interface IGraphqlProps {
  careTeamMakeTeamLead: (
    options: { variables: careTeamMakeTeamLeadVariables },
  ) => { data: careTeamMakeTeamLead };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  isMenuOpen: boolean;
  isMakeTeamLeadLoading?: boolean;
  makeTeamLeadError?: string | null;
}

export class CareTeamMember extends React.Component<allProps, IState> {
  state = { isMenuOpen: false };

  onMenuToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    const { isMenuOpen } = this.state;

    this.setState({ isMenuOpen: !isMenuOpen });
  };

  onMakeTeamLead = async () => {
    const { careTeamMember, patientId } = this.props;

    try {
      this.setState({ isMakeTeamLeadLoading: false, makeTeamLeadError: null });

      await this.props.careTeamMakeTeamLead({
        variables: {
          patientId,
          userId: careTeamMember.id,
        },
      });

      this.setState({ isMakeTeamLeadLoading: false, makeTeamLeadError: null, isMenuOpen: false });
    } catch (err) {
      this.setState({ isMakeTeamLeadLoading: false, makeTeamLeadError: err.message });
    }
  };

  onRemoveFromTeam = () => {
    const { careTeamMember, onClickToRemove } = this.props;
    this.setState({ isMenuOpen: false });
    onClickToRemove(careTeamMember);
  };

  render() {
    const { careTeamMember } = this.props;
    const { isMenuOpen } = this.state;
    const makeTeamLeadHamburgerOption = careTeamMember.isCareTeamLead ? null : (
      <HamburgerMenuOption
        messageId="patientTeam.makeTeamLead"
        icon="stars"
        onClick={this.onMakeTeamLead}
      />
    );
    const careTeamMemberNameStyles = classNames(styles.row, {
      [styles.hiddenStar]: !careTeamMember.isCareTeamLead,
    });

    return (
      <div className={classNames(styles.container, styles.body)}>
        <div className={styles.row}>
          <div className={styles.row}>
            <Avatar size="large" src={careTeamMember.googleProfileImageUrl} />
            <div className={styles.column}>
              <div className={careTeamMemberNameStyles}>
                <Text
                  text={formatFullName(careTeamMember.firstName, careTeamMember.lastName)}
                  color="black"
                  size="largest"
                  isBold={true}
                />
                <Icon name="stars" color="blue" isSmall={true} />
              </div>
              <Text
                text={formatCareTeamMemberRole(careTeamMember.userRole)}
                color="gray"
                size="medium"
              />
            </div>
          </div>
          <div className={styles.column}>
            <Text
              text={formatPhoneNumber(careTeamMember.phone) || 'Unknown Phone'}
              color="black"
              size="medium"
            />
            <Text text={careTeamMember.email || 'Unknown Email'} color="black" size="medium" />
          </div>
        </div>
        <HamburgerMenu open={isMenuOpen} onMenuToggle={this.onMenuToggle}>
          {makeTeamLeadHamburgerOption}
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

export default graphql<any>(careTeamMakeTeamLeadGraphql, {
  name: 'careTeamMakeTeamLead',
  options: (props: IProps) => ({
    refetchQueries: [
      {
        query: patientCareTeamGraphql,
        variables: {
          patientId: props.patientId,
        },
      },
    ],
  }),
})(CareTeamMember) as React.ComponentClass<IProps>;
