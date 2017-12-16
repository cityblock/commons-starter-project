import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as careTeamQuery from '../graphql/queries/get-patient-care-team.graphql';
import { getPatientCareTeamQuery, FullUserFragment } from '../graphql/types';
import CareTeamWidgetMember from './care-team-widget-member';
import * as careTeamMemberStyles from './css/care-team-widget-member.css';
import * as styles from './css/care-team-widget.css';

interface IProps {
  patientId: string;
  condensedWidget?: boolean;
}

interface IGraphqlProps {
  loading?: boolean;
  error: string | null;
  careTeam?: getPatientCareTeamQuery['patientCareTeam'];
}

type allProps = IGraphqlProps & IProps;

interface IState {
  open: boolean;
  selectedCareTeamMemberId: string | null;
}

class CareTeamWidget extends React.Component<IProps & IGraphqlProps, IState> {
  constructor(props: IProps & IGraphqlProps) {
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

  renderCareTeamMember(careTeamMember: FullUserFragment | null) {
    if (!careTeamMember) {
      return null;
    }

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
    const { selectedCareTeamMemberId } = this.state;
    this.setState({
      selectedCareTeamMemberId:
        careTeamMemberId === selectedCareTeamMemberId ? null : careTeamMemberId,
    });
  }

  onClick() {
    const { condensedWidget } = this.props;
    const { open } = this.state;
    if (!condensedWidget) {
      if (open) {
        this.setState({
          open: false,
          selectedCareTeamMemberId: null,
        });
      } else {
        this.setState({ open: !open });
      }
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
      <div key="slackContact">
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

export default graphql<IGraphqlProps, IProps, allProps>(careTeamQuery as any, {
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
