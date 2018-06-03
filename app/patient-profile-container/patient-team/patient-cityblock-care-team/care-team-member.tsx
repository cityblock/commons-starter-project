import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as careTeamMakeTeamLeadMutationGraphql from '../../../graphql/queries/care-team-make-team-lead-mutation.graphql';
import * as patientCareTeamQuery from '../../../graphql/queries/get-patient-care-team.graphql';
import {
  careTeamMakeTeamLeadMutation,
  careTeamMakeTeamLeadMutationVariables,
  FullCareTeamUserFragment,
} from '../../../graphql/types';
import { formatCareTeamMemberRole, formatFullName } from '../../../shared/helpers/format-helpers';
import Avatar from '../../../shared/library/avatar/avatar';
import HamburgerMenuOption from '../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../shared/library/hamburger-menu/hamburger-menu';
import Icon from '../../../shared/library/icon/icon';
import SmallText from '../../../shared/library/small-text/small-text';
import * as styles from '../css/team-member.css';

interface IProps {
  careTeamMember: FullCareTeamUserFragment;
  patientId: string;
  onClickToRemove: (careTeamMemberToRemove: FullCareTeamUserFragment) => void;
}

interface IGraphqlProps {
  careTeamMakeTeamLead: (
    options: { variables: careTeamMakeTeamLeadMutationVariables },
  ) => { data: careTeamMakeTeamLeadMutation };
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
    const { careTeamMakeTeamLead } = this.props;

    try {
      this.setState({ isMakeTeamLeadLoading: false, makeTeamLeadError: null });

      await careTeamMakeTeamLead({
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
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.row}>
            <Avatar size="large" src={careTeamMember.googleProfileImageUrl} />
            <div className={styles.column}>
              <div className={careTeamMemberNameStyles}>
                <SmallText
                  text={formatFullName(careTeamMember.firstName, careTeamMember.lastName)}
                  color="black"
                  size="largest"
                  isBold={true}
                />
                <Icon name="stars" color="blue" isSmall={true} />
              </div>
              <SmallText
                text={formatCareTeamMemberRole(careTeamMember.userRole)}
                color="gray"
                size="medium"
              />
            </div>
          </div>
          <div className={styles.column}>
            <SmallText text={careTeamMember.phone || 'Unknown Phone'} color="black" size="medium" />
            <SmallText text={careTeamMember.email || 'Unknown Email'} color="black" size="medium" />
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

export default graphql<any>(careTeamMakeTeamLeadMutationGraphql as any, {
  name: 'careTeamMakeTeamLead',
  options: (props: IProps) => ({
    refetchQueries: [
      {
        query: patientCareTeamQuery as any,
        variables: {
          patientId: props.patientId,
        },
      },
    ],
  }),
})(CareTeamMember) as React.ComponentClass<IProps>;
