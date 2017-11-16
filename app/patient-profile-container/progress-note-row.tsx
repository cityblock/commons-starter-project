import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import { FullProgressNoteFragment } from '../graphql/types';
import * as tabStyles from '../shared/css/tabs.css';
import * as styles from './css/progress-note-row.css';

interface IProps {
  progressNote: FullProgressNoteFragment;
}

type Tab = 'context' | 'activity';

interface IState {
  tab: Tab;
}

export default class PatientEncounters extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      tab: 'context',
    };
  }

  onTabClick = (tab: Tab) => {
    this.setState({
      tab,
    });
  };

  render() {
    const { progressNote } = this.props;
    const { tab } = this.state;
    const title = progressNote.progressNoteTemplate ? progressNote.progressNoteTemplate.title : '';

    const contextTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tab === 'context',
    });
    const activityTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tab === 'activity',
    });
    const onContextClick = () => this.onTabClick('context');
    const onActivityClick = () => this.onTabClick('activity');
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
          <div className={tabStyles.tabs}>
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
        </div>
      </div>
    );
  }
}
