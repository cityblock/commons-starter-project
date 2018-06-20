import classNames from 'classnames';
import React from 'react';
import { FullQuickCall } from '../../graphql/types';
import styles from './css/progress-note-activity.css';
import ProgressNoteActivityQuickCall from './progress-note-activity-quick-call';

interface IProps {
  quickCalls: FullQuickCall[];
  expanded: boolean;
}

class ProgressNoteActivityQuickCalls extends React.Component<IProps> {
  renderActivityQuickCalls() {
    const { quickCalls, expanded } = this.props;

    return quickCalls.map(quickCall => (
      <ProgressNoteActivityQuickCall key={quickCall.id} expanded={expanded} quickCall={quickCall} />
    ));
  }

  render() {
    const { expanded } = this.props;

    const sectionStyles = classNames(styles.sectionChild, {
      [styles.expanded]: expanded,
    });

    return <div className={sectionStyles}>{this.renderActivityQuickCalls()}</div>;
  }
}

export default ProgressNoteActivityQuickCalls;
