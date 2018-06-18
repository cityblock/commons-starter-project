import classNames from 'classnames';
import React from 'react';
import { FullPatientAnswerEventFragment } from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import styles from './css/progress-note-activity.css';
import ProgressNoteActivityPatientAnswer from './progress-note-activity-patient-answer';

interface IProps {
  patientAnswerEvents: FullPatientAnswerEventFragment[];
  expanded: boolean;
  title: string;
}

interface IState {
  answersExpanded: boolean;
}

class ProgressNoteActivityPatientAnswerGroup extends React.Component<IProps, IState> {
  state = { answersExpanded: false };

  getDisplayTitle = () => {
    const { title } = this.props;

    return `${title} Assessment Updates`;
  };

  getDisplayCount = () => {
    const { patientAnswerEvents } = this.props;

    return patientAnswerEvents.length;
  };

  onClick = () => {
    const { answersExpanded } = this.state;

    this.setState({ answersExpanded: !answersExpanded });
  };

  renderPatientAnswerEvents = () => {
    const { patientAnswerEvents } = this.props;
    const { answersExpanded } = this.state;

    return patientAnswerEvents.map(patientAnswerEvent => (
      <ProgressNoteActivityPatientAnswer
        key={patientAnswerEvent.id}
        patientAnswerEvent={patientAnswerEvent}
        expanded={answersExpanded}
      />
    ));
  };

  render() {
    const { expanded } = this.props;
    const { answersExpanded } = this.state;
    const subSectionStyles = classNames(styles.activitySection, styles.patientAnswerGroupSection, {
      [styles.expanded]: expanded,
    });
    const subLevelStyles = classNames(styles.sectionSubLevel, {
      [styles.expanded]: answersExpanded,
    });
    const displayTitle = this.getDisplayTitle();
    const displayCount = this.getDisplayCount();

    return (
      <div className={subSectionStyles}>
        <div className={subLevelStyles} onClick={this.onClick}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleText}>{displayTitle}</div>
            <div className={styles.sectionTitleCount}>({displayCount})</div>
          </div>
          <Icon name="expandArrow" className={styles.subSectionArrow} />
        </div>
        <div className={styles.patientAnswers}>{this.renderPatientAnswerEvents()}</div>
      </div>
    );
  }
}

export default ProgressNoteActivityPatientAnswerGroup;
