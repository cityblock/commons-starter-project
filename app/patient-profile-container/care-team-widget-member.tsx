import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FullUserFragment } from '../graphql/types';
import * as styles from './css/care-team-widget-member.css';

interface IProps {
  careTeamMember: FullUserFragment;
  selected: boolean;
  onClick: (careTeamMemberId: string) => any;
}

const generateIconStyles = (iconStyle: string): string =>
  classNames(styles.careTeamContactIcon, iconStyle);

const slackIconStyles = generateIconStyles(styles.careTeamSlackIcon);
const phoneIconStyles = generateIconStyles(styles.careTeamPhoneIcon);
const smsIconStyles = generateIconStyles(styles.careTeamSmsIcon);
const emailIconStyles = generateIconStyles(styles.careTeamEmailIcon);
const profileIconStyles = generateIconStyles(styles.careTeamProfileIcon);

export default class CareTeamWidgetMember extends React.Component<IProps, {}> {
  formatCareTeamMemberRole(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  render() {
    const { careTeamMember, onClick, selected } = this.props;

    const contactStyles = classNames(styles.careTeamMemberContact, { [styles.open]: selected });

    const careTeamMemberPhotoUrl = careTeamMember.googleProfileImageUrl || '';
    const careTeamMemberFullName = `${careTeamMember.firstName} ${careTeamMember.lastName}`;
    const careTeamMemberRole = this.formatCareTeamMemberRole(careTeamMember.userRole);

    return (
      <div className={styles.careTeamMemberRow}>
        <div className={styles.careTeamMemberDetails} onClick={() => onClick(careTeamMember.id)}>
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
            <div className={slackIconStyles} />
            <FormattedMessage id='careTeam.slack'>
              {(message: string) => <div className={styles.careTeamContactLabel}>{message}</div>}
            </FormattedMessage>
          </div>
          <div className={styles.careTeamMemberContactRow}>
            <div className={phoneIconStyles} />
            <FormattedMessage id='careTeam.call'>
              {(message: string) => <div className={styles.careTeamContactLabel}>{message}</div>}
            </FormattedMessage>
          </div>
          <div className={styles.careTeamMemberContactRow}>
            <div className={smsIconStyles} />
            <FormattedMessage id='careTeam.text'>
              {(message: string) => <div className={styles.careTeamContactLabel}>{message}</div>}
            </FormattedMessage>
          </div>
          <div className={styles.careTeamMemberContactRow}>
            <div className={emailIconStyles} />
            <FormattedMessage id='careTeam.email'>
              {(message: string) => <div className={styles.careTeamContactLabel}>{message}</div>}
            </FormattedMessage>
          </div>
          <div className={styles.careTeamMemberContactRow}>
            <div className={profileIconStyles} />
            <FormattedMessage id='careTeam.profile'>
              {(message: string) => <div className={styles.careTeamContactLabel}>{message}</div>}
            </FormattedMessage>
          </div>
        </div>
      </div>
    );
  }
}
