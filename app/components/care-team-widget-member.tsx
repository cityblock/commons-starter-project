import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from '../css/components/care-team-widget-member.css';
import { FullUserFragment } from '../graphql/types';

interface IProps {
  careTeamMember: FullUserFragment;
  selected: boolean;
  onClick: (careTeamMemberId: string) => any;
}

const generateIconStyles = (iconStyle: string): string => (
  classNames(styles.careTeamContactIcon, iconStyle)
);

const slackIconStyles   = generateIconStyles(styles.careTeamSlackIcon);
const phoneIconStyles   = generateIconStyles(styles.careTeamPhoneIcon);
const smsIconStyles     = generateIconStyles(styles.careTeamSmsIcon);
const emailIconStyles   = generateIconStyles(styles.careTeamEmailIcon);
const profileIconStyles = generateIconStyles(styles.careTeamProfileIcon);

export default class CareTeamWidgetMember extends React.Component<IProps, {}> {
  constructor(props: any) {
    super(props);
  }

  formatCareTeamMemberRole(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  render() {
    const { careTeamMember, onClick } = this.props;

    const contactStyles = classNames(
      styles.careTeamMemberContact,
      { [styles.open]: this.props.selected },
    );

    const careTeamMemberPhotoUrl = careTeamMember.googleProfileImageUrl || '';
    const careTeamMemberFullName = `${careTeamMember.firstName} ${careTeamMember.lastName}`;
    const careTeamMemberRole = this.formatCareTeamMemberRole(careTeamMember.userRole);

    return (
      <div className={styles.careTeamMemberRow}>
        <div
          className={styles.careTeamMemberDetails}
          onClick={() => (onClick(careTeamMember.id))}>
          <div className={styles.careTeamMemberPhoto}>
            <img src={careTeamMemberPhotoUrl} />
          </div>
          <div className={styles.careTeamMemberLabel}>
            <div className={styles.careTeamMemberName}>{careTeamMemberFullName}</div>
            <div className={styles.careTeamMemberRole}>{careTeamMemberRole}</div>
          </div>
        </div>
        <div className={contactStyles}>
          <div className={styles.careTeamMemberContactRow}>
            <div className={slackIconStyles}></div>
            <div className={styles.careTeamContactLabel}>Message on Slack</div>
          </div>
          <div className={styles.careTeamMemberContactRow}>
            <div className={phoneIconStyles}></div>
            <div className={styles.careTeamContactLabel}>Call on phone</div>
          </div>
          <div className={styles.careTeamMemberContactRow}>
            <div className={smsIconStyles}></div>
            <div className={styles.careTeamContactLabel}>Send text message</div>
          </div>
          <div className={styles.careTeamMemberContactRow}>
            <div className={emailIconStyles}></div>
            <div className={styles.careTeamContactLabel}>Send an email</div>
          </div>
          <div className={styles.careTeamMemberContactRow}>
            <div className={profileIconStyles}></div>
            <div className={styles.careTeamContactLabel}>Go to profile</div>
          </div>
        </div>
      </div>
    );
  }
}
