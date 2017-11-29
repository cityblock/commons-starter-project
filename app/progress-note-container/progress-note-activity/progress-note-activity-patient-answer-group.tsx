import * as classNames from 'classnames';
import * as React from 'react';
import { FullPatientAnswerEventFragment } from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import * as styles from '../css/progress-note-popup.css';
import ProgressNoteActivityPatientAnswer from './progress-note-activity-patient-answer';

interface IProps {
  patientAnswerEvents: FullPatientAnswerEventFragment[];
  title: string;
  expanded: boolean;
}

interface IState {
  answersExpanded: boolean;
}

class ProgressNoteActivityPatientAnswerGroup extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { answersExpanded: false };
  }

  getDisplayTitle = () => {
    const { title } = this.props;

    return `${title} Domain Updates`;
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
