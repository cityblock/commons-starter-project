import * as classNames from 'classnames';
import { groupBy, keys } from 'lodash';
import * as React from 'react';
import { FullCarePlanUpdateEventFragment } from '../../graphql/types';
import * as styles from './css/progress-note-activity.css';
import ProgressNoteActivityCarePlanUpdate from './progress-note-activity-care-plan-update';

interface IProps {
  carePlanUpdates: FullCarePlanUpdateEventFragment[];
  expanded: boolean;
}

class ProgressNoteActivityCarePlanUpdates extends React.Component<IProps> {
  renderConcernUpdates = () => {
    const { carePlanUpdates, expanded } = this.props;
    const concernUpdates = carePlanUpdates.filter(
      carePlanUpdate => !!carePlanUpdate.eventType.match('concern'),
    );
    const groupedConcernUpdates = groupBy(concernUpdates, 'patientConcernId');

    return keys(groupedConcernUpdates).map(patientConcernId => (
      <ProgressNoteActivityCarePlanUpdate
        key={patientConcernId}
        updateType={'concern'}
        carePlanUpdateEvents={groupedConcernUpdates[patientConcernId]}
        expanded={expanded}
      />
    ));
  };

  renderGoalUpdates = () => {
    const { carePlanUpdates, expanded } = this.props;
    const goalUpdates = carePlanUpdates.filter(
      carePlanUpdate => !!carePlanUpdate.eventType.match('goal'),
    );
    const groupedGoalUpdates = groupBy(goalUpdates, 'patientGoalId');

    return keys(groupedGoalUpdates).map(patientGoalId => (
      <ProgressNoteActivityCarePlanUpdate
        key={patientGoalId}
        updateType={'goal'}
        carePlanUpdateEvents={groupedGoalUpdates[patientGoalId]}
        expanded={expanded}
      />
    ));
  };

  renderActivityCarePlanUpdates = () => {
    const concernUpdates = this.renderConcernUpdates();
    const goalUpdates = this.renderGoalUpdates();

    return concernUpdates.concat(goalUpdates);
  };

  render() {
    const { expanded } = this.props;

    const sectionStyles = classNames(styles.sectionChild, {
      [styles.expanded]: expanded,
    });

    return <div className={sectionStyles}>{this.renderActivityCarePlanUpdates()}</div>;
  }
}

export default ProgressNoteActivityCarePlanUpdates;
