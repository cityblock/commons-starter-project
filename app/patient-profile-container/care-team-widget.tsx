import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as careTeamQuery from '../graphql/queries/get-patient-care-team.graphql';
import { FullUserFragment } from '../graphql/types';
import CareTeamWidgetMember from './care-team-widget-member';
import * as careTeamMemberStyles from './css/care-team-widget-member.css';
import * as styles from './css/care-team-widget.css';

interface IProps {
  patientId: string;
  loading?: boolean;
  error?: string;
  careTeam?: FullUserFragment[];
  condensedWidget?: boolean;
}

interface IState {
  open: boolean;
  selectedCareTeamMemberId: string | null;
}

class CareTeamWidget extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const { condensedWidget } = props;

    this.onClick = this.onClick.bind(this);
    this.onCareTeamMemberClick = this.onCareTeamMemberClick.bind(this);
    this.renderCareTeamMember = this.renderCareTeamMember.bind(this);

    this.state = {
      open: condensedWidget ? true : false,
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
    const { condensedWidget } = this.props;

    if (!condensedWidget) {
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
  }

  render() {
    const { careTeam, condensedWidget } = this.props;

    const careTeamWidgetClasses = classNames(styles.careTeamWidget, {
      [styles.skinny]: condensedWidget,
    });
    const buttonClasses = classNames(styles.button, {
      [styles.openButton]: this.state.open,
      [styles.condensed]: condensedWidget,
    });
    const drawerClasses = classNames(styles.drawer, {
      [styles.open]: this.state.open,
      [styles.tall]: condensedWidget,
    });
    const buttonIconClasses = classNames(styles.buttonIcon, {
      [styles.hidden]: condensedWidget,
    });
    const buttonArrowClasses = classNames(styles.buttonArrow, {
      [styles.hidden]: condensedWidget,
    });

    const slackContact = (
      <div key='slackContact'>
        <div className={careTeamMemberStyles.careTeamMemberRow}>
          <div className={careTeamMemberStyles.careTeamMemberDetails}>
            <div className={styles.chatLogo} />
            <div className={careTeamMemberStyles.careTeamMemberLabel}>
              <div className={careTeamMemberStyles.careTeamMemberName}>Chat with team</div>
              <div className={careTeamMemberStyles.careTeamMemberRole}>Patient slack channel</div>
            </div>
          </div>
        </div>
        <div className={careTeamMemberStyles.careTeamMemberContact} />
      </div>
    );

    const renderedCareTeamMembers = (careTeam || []).map(this.renderCareTeamMember);

    renderedCareTeamMembers.unshift(slackContact);

    return (
      <div className={careTeamWidgetClasses}>
        <div className={styles.careTeamWidgetRow}>
          <div className={styles.careTeamWidgetContent}>
            <div className={buttonClasses} onClick={this.onClick}>
              <div className={styles.buttonLabel}>
                <div className={buttonIconClasses} />
                <div className={styles.buttonTitle}>Care Team</div>
              </div>
              <div className={buttonArrowClasses} />
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
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    careTeam: data ? (data as any).patientCareTeam : null,
  }),
})(CareTeamWidget);
