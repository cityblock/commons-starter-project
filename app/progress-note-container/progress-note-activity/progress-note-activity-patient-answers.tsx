import * as classNames from 'classnames';
import { filter, groupBy, keys } from 'lodash';
import * as React from 'react';
import { FullPatientAnswerEventFragment } from '../../graphql/types';
import * as styles from '../css/progress-note-activity.css';
import ProgressNoteActivityPatientAnswerGroup from './progress-note-activity-patient-answer-group';

interface IProps {
  patientAnswerEvents: FullPatientAnswerEventFragment[];
  expanded: boolean;
}

class ProgressNoteActivityPatientAnswers extends React.Component<IProps> {
  renderActivityPatientAnswers = () => {
    const { expanded, patientAnswerEvents } = this.props;
    const filteredEvents = filter(patientAnswerEvents, patientAnswerEvent => {
      const answer = patientAnswerEvent.patientAnswer.answer;

      return !!answer.riskArea;
    });
    const groupedEvents = groupBy(
      filteredEvents,
      (patientAnswerEvent: FullPatientAnswerEventFragment) => {
        const answer = patientAnswerEvent.patientAnswer.answer;

        return answer.riskArea!.id;
      },
    );

    return keys(groupedEvents).map(patientAnswerEventsGroupId => {
      const events = groupedEvents[patientAnswerEventsGroupId];
      const answer = events[0].patientAnswer.answer;
      const title = answer.riskArea!.title;

      return (
        <ProgressNoteActivityPatientAnswerGroup
          key={events[0].id}
          patientAnswerEvents={events}
          title={title}
          expanded={expanded}
        />
      );
    });
  };

  render() {
    const { expanded } = this.props;

    const sectionStyles = classNames(styles.sectionChild, {
      [styles.expanded]: expanded,
    });

    return <div className={sectionStyles}>{this.renderActivityPatientAnswers()}</div>;
  }
}

export default ProgressNoteActivityPatientAnswers;
