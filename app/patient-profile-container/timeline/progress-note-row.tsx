import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { FullProgressNoteFragment } from '../../graphql/types';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import ProgressNoteActivity from '../../shared/progress-note-activity/progress-note-activity';
import * as styles from './css/progress-note-row.css';
import ProgressNoteRowQuestions from './progress-note-row-questions';
import ProgressNoteSupervisorBadge from './progress-note-supervisor-badge';
import ProgressNoteSupervisorNotes from './progress-note-supervisor-notes';

interface IProps {
  progressNote: FullProgressNoteFragment;
  patientId: string;
}

type Tab = 'context' | 'activity' | 'supervisor-review';

interface IState {
  tab: Tab | null;
}

export default class ProgressNoteRow extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      tab: null,
    };
  }

  onTabClick = (tab: Tab) => {
    this.setState({
      tab,
    });
  };

  render() {
    const { progressNote, patientId } = this.props;
    const { tab } = this.state;
    const title = progressNote.progressNoteTemplate ? progressNote.progressNoteTemplate.title : '';

    const tabContainerStyles = classNames(styles.tabs, {
      [styles.tabsNoBorder]: !tab,
    });
    // hide summary when on a tab
    const summary = tab ? null : <div className={styles.summary}>{progressNote.summary}</div>;
    const onContextClick = () => this.onTabClick('context');
    const onActivityClick = () => this.onTabClick('activity');
    const onSupervisorReviewClick = () => this.onTabClick('supervisor-review');
    const questionsHtml =
      tab === 'context' ? (
        <ProgressNoteRowQuestions
          goToActivityTab={onActivityClick}
          patientId={patientId}
          progressNote={progressNote}
        />
      ) : null;
    const activityHtml =
      tab === 'activity' ? <ProgressNoteActivity progressNote={progressNote} /> : null;
    const supervisorTab = progressNote.supervisorNotes ? (
      <UnderlineTab
        messageId="progressNote.supervisorReview"
        onClick={onSupervisorReviewClick}
        selected={tab === 'supervisor-review'}
      />
    ) : null;
    const supervisorTabHtml =
      progressNote.supervisorNotes && progressNote.reviewedBySupervisorAt ? (
        <ProgressNoteSupervisorNotes
          supervisor={progressNote.supervisor}
          reviewedBySupervisorAt={progressNote.reviewedBySupervisorAt}
          supervisorNotes={progressNote.supervisorNotes}
        />
      ) : null;
    const containerStyles = classNames(styles.container, {
      [styles.dashed]: progressNote.needsSupervisorReview,
    });
    return (
      <div className={containerStyles}>
        <div className={styles.topBar}>
          <div className={styles.userSection}>
            <div className={styles.userName}>{progressNote.user.firstName}</div>
            <div className={styles.userRole}>{progressNote.user.userRole}</div>
          </div>
          <div className={styles.dateSection}>
            <FormattedTime value={progressNote.createdAt}>
              {(time: string) => <span className={styles.createdTime}>{time}</span>}
            </FormattedTime>
            <FormattedDate value={progressNote.createdAt} />
          </div>
        </div>
        <div className={styles.titleSection}>
          <div className={styles.title}>
            {title}
            <ProgressNoteSupervisorBadge progressNote={progressNote} />
          </div>
          <div className={styles.dotHamburger} />
        </div>
        {summary}
        <UnderlineTabs color="white" className={tabContainerStyles}>
          <UnderlineTab
            messageId="patient.context"
            onClick={onContextClick}
            selected={tab === 'context'}
          />
          <UnderlineTab
            messageId="patient.activity"
            onClick={onActivityClick}
            selected={tab === 'activity'}
          />
          {supervisorTab}
        </UnderlineTabs>
        {questionsHtml}
        {activityHtml}
        {supervisorTabHtml}
      </div>
    );
  }
}
