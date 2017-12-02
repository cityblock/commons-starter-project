import * as classNames from 'classnames';
import * as React from 'react';
import { FullQuickCallFragment } from '../../graphql/types';
import * as styles from '../css/progress-note-activity.css';
import ProgressNoteActivityQuickCall from './progress-note-activity-quick-call';

interface IProps {
  quickCalls: FullQuickCallFragment[];
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
