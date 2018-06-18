import classNames from 'classnames';
import React from 'react';
import { FormattedDate } from 'react-intl';
import { FullQuickCallFragment } from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import styles from './css/progress-note-activity.css';

interface IProps {
  quickCall: FullQuickCallFragment;
  expanded: boolean;
}

interface IState {
  summaryExpanded: boolean;
}

class ProgressNoteActivityQuickCall extends React.Component<IProps, IState> {
  state = { summaryExpanded: false };

  onClick = () => {
    const { summaryExpanded } = this.state;

    this.setState({ summaryExpanded: !summaryExpanded });
  };

  getLabel() {
    const { quickCall } = this.props;
    const { callRecipient } = quickCall;

    if (quickCall.direction === 'Inbound') {
      return `Call from ${callRecipient}`;
    } else {
      return `Call to ${callRecipient}`;
    }
  }

  render() {
    const { quickCall, expanded } = this.props;
    const { summaryExpanded } = this.state;
    const subSectionStyles = classNames(styles.activitySection, styles.quickCallSection, {
      [styles.expanded]: expanded,
      [styles.successful]: quickCall.wasSuccessful,
    });
    const subLevelStyles = classNames(styles.sectionSubLevel, {
      [styles.expanded]: summaryExpanded,
    });

    return (
      <div className={subSectionStyles}>
        <div className={subLevelStyles} onClick={this.onClick}>
          <div className={styles.sectionTitle}>
            <Icon name="phone" className={styles.phoneIcon} />
            <div className={styles.quickCallTitle}>{this.getLabel()}:</div>
            <div className={styles.quickCallType}>{quickCall.reason}</div>
          </div>
          <Icon name="expandArrow" className={styles.subSectionArrow} />
        </div>
        <div className={styles.quickCallSummary}>
          <div className={styles.quickCallSummaryText}>{quickCall.summary}</div>
          <FormattedDate value={quickCall.startTime}>
            {(date: string) => <div className={styles.quickCallSummaryDate}>{date}</div>}
          </FormattedDate>
        </div>
      </div>
    );
  }
}

export default ProgressNoteActivityQuickCall;
