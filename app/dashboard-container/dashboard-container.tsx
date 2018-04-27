import { History } from 'history';
import * as React from 'react';
import withCurrentUser, { IInjectedProps } from '../shared/with-current-user/with-current-user';
import * as styles from './css/dashboard-container.css';
import DashboardPatients from './dashboard-patients';
import DashboardNavigation from './navigation/navigation';

export type Selected =
  | 'tasks'
  | 'conversations'
  | 'referrals'
  | 'new'
  | 'suggestions'
  | 'demographics'
  | 'engage'
  | 'updateMAP'
  | 'computed'
  | 'loading'
  | 'assigned'
  | 'intake';

interface IProps extends IInjectedProps {
  match: {
    params: {
      list: Selected;
      answerId?: string;
    };
  };
  history: History;
}

export class DashboardContainer extends React.Component<IProps> {
  title = 'Dashboard';

  componentDidMount() {
    document.title = `${this.title} | Commons`;
  }
  render(): JSX.Element {
    const {
      match: {
        params: { list, answerId },
      },
    } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <DashboardNavigation selected={list} answerId={answerId || null} />
        </div>
        <div className={styles.rightPane}>
          <DashboardPatients selected={list} answerId={answerId || null} />
        </div>
      </div>
    );
  }
}

export default withCurrentUser()(DashboardContainer);
