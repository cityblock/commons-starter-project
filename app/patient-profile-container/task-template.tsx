import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedDate } from 'react-intl';
import { dateAdd } from '../../server/lib/date';
import { getPatientCareTeamQuery, FullTaskTemplateFragment } from '../graphql/types';
import Avatar from '../shared/library/avatar/avatar';
import * as styles from './css/patient-care-plan.css';

interface IProps {
  taskTemplate: FullTaskTemplateFragment;
  selected: boolean;
  onToggleRemoved: (taskTemplateId: string) => any;
  careTeam?: getPatientCareTeamQuery['patientCareTeam'];
}

export default class TaskTemplate extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.getDueDate = this.getDueDate.bind(this);
    this.getAssigneeAvatarUrl = this.getAssigneeAvatarUrl.bind(this);
  }

  getDueDate() {
    const { taskTemplate } = this.props;
    const { completedWithinInterval, completedWithinNumber } = taskTemplate;

    if (completedWithinInterval && completedWithinNumber) {
      const date = dateAdd(new Date(Date.now()), completedWithinNumber, completedWithinInterval);
      return <FormattedDate value={date} year="numeric" month="short" day="numeric" />;
    } else {
      return 'No due date set';
    }
  }

  getAssigneeAvatarUrl() {
    const { taskTemplate, careTeam } = this.props;
    const { careTeamAssigneeRole } = taskTemplate;

    if (careTeamAssigneeRole && careTeam) {
      const assignedCareTeamMember = careTeam.find(
        careTeamMember =>
          careTeamMember ? careTeamMember.userRole === careTeamAssigneeRole : false,
      );

      if (assignedCareTeamMember && assignedCareTeamMember.googleProfileImageUrl) {
        return assignedCareTeamMember.googleProfileImageUrl;
      }
    }
  }

  render() {
    const { taskTemplate, selected, onToggleRemoved } = this.props;

    const rowStyles = classNames(styles.taskTemplateRow, {
      [styles.removedTask]: !selected,
      [styles.highPriority]: taskTemplate.priority === 'high',
      [styles.mediumPriority]: taskTemplate.priority === 'medium',
    });

    return (
      <div className={rowStyles}>
        <div className={styles.taskTemplateTitle}>{taskTemplate.title}</div>
        <div className={styles.taskTemplateInfoControls}>
          <Avatar src={this.getAssigneeAvatarUrl()} size="small" />
          <div className={styles.taskTemplateDueDate}>
            <div className={styles.taskTemplateDueDateLabel}>Due:</div>
            <div className={styles.taskTemplateDueDateText}>{this.getDueDate()}</div>
          </div>
          <div
            className={styles.taskTemplateRejectButton}
            onClick={() => onToggleRemoved(taskTemplate.id)}
          />
        </div>
      </div>
    );
  }
}
