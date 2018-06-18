import classNames from 'classnames';
import React from 'react';
import { FullPatientScreeningToolSubmissionFragment } from '../../graphql/types';
import styles from './css/progress-note-activity.css';
import ProgressNoteActivityScreeningToolSubmission from './progress-note-activity-screening-tool-submission';

interface IProps {
  screeningToolSubmissions: FullPatientScreeningToolSubmissionFragment[];
  expanded: boolean;
}

class ProgressNoteActivityScreeningToolSubmissions extends React.Component<IProps> {
  renderActivityScreeningToolSubmissions() {
    const { screeningToolSubmissions, expanded } = this.props;

    return screeningToolSubmissions.map(screeningToolSubmission => (
      <ProgressNoteActivityScreeningToolSubmission
        key={screeningToolSubmission.id}
        expanded={expanded}
        screeningToolSubmission={screeningToolSubmission}
      />
    ));
  }

  render() {
    const { expanded } = this.props;

    const sectionStyles = classNames(styles.sectionChild, {
      [styles.expanded]: expanded,
    });

    return <div className={sectionStyles}>{this.renderActivityScreeningToolSubmissions()}</div>;
  }
}

export default ProgressNoteActivityScreeningToolSubmissions;
