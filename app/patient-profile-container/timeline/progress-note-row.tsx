import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import { FullProgressNoteFragment } from '../../graphql/types';
import * as tabStyles from '../../shared/css/tabs.css';
import ProgressNoteActivity from '../../shared/progress-note-activity/progress-note-activity';
import * as styles from './css/progress-note-row.css';
import ProgressNoteRowQuestions from './progress-note-row-questions';

interface IProps {
  progressNote: FullProgressNoteFragment;
  patientId: string;
}

type Tab = 'context' | 'activity';

interface IState {
  tab?: Tab;
}

export default class ProgressNoteRow extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      tab: undefined,
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

    const contextTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tab === 'context',
    });
    const activityTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tab === 'activity',
    });
    const tabContainerStyles = classNames(tabStyles.tabs, styles.tabs, {
      [styles.tabsNoBorder]: !tab,
    });
    const onContextClick = () => this.onTabClick('context');
    const onActivityClick = () => this.onTabClick('activity');
    const questionsHtml =
      tab === 'context' ? (
        <ProgressNoteRowQuestions progressNoteId={progressNote.id} patientId={patientId} />
      ) : null;
    const activityHtml =
      tab === 'activity' ? (
        <ProgressNoteActivity progressNote={progressNote} patientId={patientId} />
      ) : null;
    return (
      <div className={styles.container}>
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
          <div className={styles.title}>{title}</div>
          <div className={styles.dotHamburger} />
        </div>
        <div className={styles.summary}>{progressNote.summary}</div>
        <div className={tabContainerStyles}>
          <FormattedMessage id="patient.context">
            {(message: string) => (
              <div className={contextTabStyles} onClick={onContextClick}>
                {message}
              </div>
            )}
          </FormattedMessage>
          <FormattedMessage id="patient.activity">
            {(message: string) => (
              <div onClick={onActivityClick} className={activityTabStyles}>
                {message}
              </div>
            )}
          </FormattedMessage>
        </div>
        {questionsHtml}
        {activityHtml}
      </div>
    );
  }
}
