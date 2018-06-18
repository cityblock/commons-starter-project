import classNames from 'classnames';
import { filter, includes, toString } from 'lodash';
import React from 'react';
import { getPatientCareTeamQuery, FullCareTeamUserFragment } from '../../../graphql/types';
import { formatFullName } from '../../../shared/helpers/format-helpers';
import FormLabel from '../../../shared/library/form-label/form-label';
import OptGroup from '../../../shared/library/optgroup/optgroup';
import Option from '../../../shared/library/option/option';
import Select from '../../../shared/library/select/select';
import Text from '../../../shared/library/text/text';
import styles from './css/remove-care-team-member.css';

interface IProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  tasksCount: number;
  isLoading?: boolean;
  careTeamMember?: FullCareTeamUserFragment | null;
  reassignedToId?: string | null;
  careTeam?: getPatientCareTeamQuery['patientCareTeam'];
}

class RemoveCareTeamMember extends React.Component<IProps> {
  renderCareTeamOptions(careTeamRole: string) {
    const { careTeam, careTeamMember } = this.props;

    if (!careTeam || !careTeamMember) {
      return null;
    }

    const validCareTeamMembers = filter(
      careTeam,
      teamMember => teamMember.id !== careTeamMember.id && teamMember.userRole === careTeamRole,
    );

    return validCareTeamMembers.map(teamMember => (
      <Option
        key={`option-${teamMember.id}`}
        value={teamMember.id}
        label={formatFullName(teamMember.firstName, teamMember.lastName)}
      />
    ));
  }

  renderOptionGroups() {
    const { careTeam, careTeamMember } = this.props;
    const careTeamRoles: string[] = [];

    if (!careTeam || !careTeamMember) {
      return;
    }

    // Build up a list of careTeamRoles
    careTeam.forEach(teamMember => {
      const isExistingCareTeamRole = includes(careTeamRoles, teamMember.userRole);

      if (teamMember.id !== careTeamMember.id && !isExistingCareTeamRole) {
        careTeamRoles.push(teamMember.userRole);
      }
    });

    return careTeamRoles.map(careTeamRole => (
      <OptGroup messageId={`careWorker.${careTeamRole}`} key={`optgroup-${careTeamRole}`}>
        {this.renderCareTeamOptions(careTeamRole)}
      </OptGroup>
    ));
  }

  render() {
    const { isLoading, tasksCount, onChange, reassignedToId, careTeamMember } = this.props;

    const reassignmentSectionStyles = classNames(styles.careTeamMemberReassignmentSection, {
      [styles.hidden]: isLoading || tasksCount === 0,
    });
    const careTeamMemberStatsStyles = classNames(styles.careTeamMemberStats, {
      [styles.hidden]: isLoading || tasksCount === 0,
    });
    const careTeamMemberName = careTeamMember
      ? formatFullName(careTeamMember.firstName, careTeamMember.lastName)
      : 'Loading...';
    const careTeamMemberUserRole = careTeamMember ? careTeamMember.userRole : 'unknown';

    return (
      <div className={styles.removeCareTeamMember}>
        <div className={styles.careTeamMemberInfo}>
          <div className={styles.careTeamMemberName}>
            <Text
              messageId="patientTeam.careMemberToRemoveLabel"
              color="red"
              size="medium"
              className={styles.careTeamMemberNameLabel}
            />
            <div className={styles.careTeamMemberNameAndTitle}>
              <Text text={careTeamMemberName} size="large" color="black" />
              <Text
                messageId={`patientTeam.${careTeamMemberUserRole}`}
                size="medium"
                color="gray"
                className={styles.careTeamMemberTitle}
              />
            </div>
          </div>
          <div className={careTeamMemberStatsStyles}>
            <Text
              messageId="patientTeam.openTasks"
              color="red"
              size="medium"
              className={styles.careTeamMemberTasksLabel}
            />
            <Text
              text={toString(tasksCount)}
              color="black"
              size="medium"
              className={styles.careTeamMemberTasksCount}
            />
          </div>
        </div>
        <div className={reassignmentSectionStyles}>
          <FormLabel messageId="patientTeam.careMemberToReassignTo" />
          <Select
            name="reassignedToId"
            value={reassignedToId || ''}
            onChange={onChange}
            large={true}
          >
            <Option
              disabled={true}
              messageId="patientTeam.careMemberToReassignToPlaceholder"
              value=""
            />
            {this.renderOptionGroups()}
          </Select>
        </div>
      </div>
    );
  }
}

export default RemoveCareTeamMember;
