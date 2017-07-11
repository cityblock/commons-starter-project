import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as careTeamMemberStyles from '../css/components/care-team-widget-member.css';
import * as styles from '../css/components/care-team-widget.css';
import * as careTeamQuery from '../graphql/queries/get-patient-care-team.graphql';
import { FullUserFragment } from '../graphql/types';
import CareTeamWidgetMember from './care-team-widget-member';

export interface IProps {
  patientId: string;
  loading?: boolean;
  error?: string;
  careTeam?: FullUserFragment[];
}

export interface IState {
  open: boolean;
  selectedCareTeamMemberId: string | null;
}

class CareTeamWidget extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onCareTeamMemberClick = this.onCareTeamMemberClick.bind(this);
    this.renderCareTeamMember = this.renderCareTeamMember.bind(this);

    this.state = {
      open: false,
      selectedCareTeamMemberId: null,
    };
  }

  renderCareTeamMember(careTeamMember: FullUserFragment) {
    const selected = careTeamMember.id === this.state.selectedCareTeamMemberId;

    return (
      <CareTeamWidgetMember
        key={careTeamMember.id}
        careTeamMember={careTeamMember}
        onClick={this.onCareTeamMemberClick}
        selected={selected}
      />
    );
  }

  onCareTeamMemberClick(careTeamMemberId: string) {
    this.setState((prevState: IState) => {
      const { selectedCareTeamMemberId } = prevState;

      if (careTeamMemberId === selectedCareTeamMemberId) {
        return { selectedCareTeamMemberId: null };
      } else {
        return { selectedCareTeamMemberId: careTeamMemberId };
      }
    });
  }

  onClick() {
    this.setState((prevState: IState) => {
      if (prevState.open) {
        return {
          open: false,
          selectedCareTeamMemberId: null,
        };
      } else {
        return { open: !prevState.open };
      }
    });
  }

  render() {
    const { careTeam } = this.props;

    const buttonClasses = classNames(styles.button, { [styles.openButton]: this.state.open });
    const drawerClasses = classNames(styles.drawer, { [styles.open]: this.state.open });

    const slackContact = (
      <div key='slackContact'>
        <div className={careTeamMemberStyles.careTeamMemberRow}>
          <div className={careTeamMemberStyles.careTeamMemberDetails}>
            <div className={styles.chatLogo}></div>
            <div className={careTeamMemberStyles.careTeamMemberLabel}>
              <div className={careTeamMemberStyles.careTeamMemberName}>Chat with team</div>
              <div className={careTeamMemberStyles.careTeamMemberRole}>Patient slack channel</div>
            </div>
          </div>
        </div>
        <div className={careTeamMemberStyles.careTeamMemberContact}></div>
      </div>
    );

    const renderedCareTeamMembers = (careTeam || []).map(this.renderCareTeamMember);

    renderedCareTeamMembers.unshift(slackContact);

    return (
      <div className={styles.careTeamWidget}>
        <div className={styles.careTeamWidgetRow}>
          <div className={styles.careTeamWidgetContent}>
            <div className={buttonClasses} onClick={this.onClick}>
              <div className={styles.buttonLabel}>
                <div className={styles.buttonIcon}></div>
                <div className={styles.buttonTitle}>Care Team</div>
              </div>
              <div className={styles.buttonArrow}></div>
            </div>
            <div className={drawerClasses}>{renderedCareTeamMembers}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default graphql(careTeamQuery as any, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }) => ({
    loading: (data ? data.loading : false),
    error: (data ? data.error : null),
    careTeam: (data ? (data as any).patientCareTeam : null),
  }),
})(CareTeamWidget);
