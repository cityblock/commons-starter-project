import classNames from 'classnames';
import React from 'react';
import { getProgressNoteActivityForProgressNoteQuery } from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import styles from './css/progress-note-activity.css';
import ProgressNoteActivityCarePlanUpdates from './progress-note-activity-care-plan-updates';
import ProgressNoteActivityPatientAnswers from './progress-note-activity-patient-answers';
import ProgressNoteActivityQuickCalls from './progress-note-activity-quick-calls';
import ProgressNoteActivityScreeningToolSubmissions from './progress-note-activity-screening-tool-submissions';
import ProgressNoteActivityTasks from './progress-note-activity-tasks';

type ActivityType =
  | 'taskEvents'
  | 'patientAnswerEvents'
  | 'carePlanUpdateEvents'
  | 'patientScreeningToolSubmissions'
  | 'quickCallEvents';

interface IProps {
  activityType: ActivityType;
  progressNoteActivity?: getProgressNoteActivityForProgressNoteQuery['progressNoteActivityForProgressNote'];
}

interface IState {
  expanded: boolean;
}

class ProgressNoteActivitySection extends React.Component<IProps, IState> {
  state = { expanded: false };

  getSectionTitle = () => {
    const { activityType } = this.props;

    switch (activityType) {
      case 'taskEvents':
        return 'Task Updates';
      case 'patientAnswerEvents':
        return '360 View Updates';
      case 'carePlanUpdateEvents':
        return 'MAP Updates';
      case 'quickCallEvents':
        return 'Quick Calls';
      case 'patientScreeningToolSubmissions':
        return 'Screening Tool Submissions';
      default:
        return 'Unknown Activity Type';
    }
  };

  getSectionCount = () => {
    const { activityType, progressNoteActivity } = this.props;

    if (!progressNoteActivity) {
      return 0;
    }

    const events = progressNoteActivity[activityType];
    if (!events) {
      return 0;
    }

    return events.length;
  };

  onClick = () => {
    const { expanded } = this.state;

    this.setState({ expanded: !expanded });
  };

  renderSectionChild = () => {
    const { activityType, progressNoteActivity } = this.props;
    const { expanded } = this.state;

    if (!progressNoteActivity) {
      return null;
    }

    switch (activityType) {
      case 'taskEvents':
        return (
          <ProgressNoteActivityTasks
            expanded={expanded}
            taskEvents={progressNoteActivity.taskEvents}
          />
        );
      case 'patientAnswerEvents':
        return (
          <ProgressNoteActivityPatientAnswers
            expanded={expanded}
            patientAnswerEvents={progressNoteActivity.patientAnswerEvents}
          />
        );
      case 'carePlanUpdateEvents':
        return (
          <ProgressNoteActivityCarePlanUpdates
            expanded={expanded}
            carePlanUpdates={progressNoteActivity.carePlanUpdateEvents}
          />
        );
      case 'quickCallEvents':
        return (
          <ProgressNoteActivityQuickCalls
            expanded={expanded}
            quickCalls={progressNoteActivity.quickCallEvents}
          />
        );
      case 'patientScreeningToolSubmissions':
        return (
          <ProgressNoteActivityScreeningToolSubmissions
            expanded={expanded}
            screeningToolSubmissions={progressNoteActivity.patientScreeningToolSubmissions}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { expanded } = this.state;

    const sectionTitle = this.getSectionTitle();
    const activityCount = this.getSectionCount();

    const sectionStyles = classNames(styles.activitySection, {
      [styles.expanded]: !!expanded,
      [styles.hidden]: activityCount === 0,
    });

    return (
      <div className={sectionStyles}>
        <div className={styles.sectionTopLevel} onClick={this.onClick}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleText}>{sectionTitle}</div>
            <div className={styles.sectionTitleCount}>({activityCount})</div>
          </div>
          <Icon name="expandArrow" className={styles.activitySectionArrow} />
        </div>
        {this.renderSectionChild()}
      </div>
    );
  }
}

export default ProgressNoteActivitySection;
