import * as React from 'react';
import * as styles from './css/dashboard-container.css';
import DashboardPatients from './dashboard-patients';
import DashboardNavigation from './navigation/navigation';

export type Selected =
  | 'tasks'
  | 'referrals'
  | 'new'
  | 'suggestions'
  | 'demographics'
  | 'engage'
  | 'updateMAP'
  | 'computed'
  | 'loading';

interface IProps {
  match: {
    params: {
      list: Selected;
      answerId?: string;
    };
  };
}

const DashboardContainer: React.StatelessComponent<IProps> = (props: IProps) => {
  const { match: { params: { list, answerId } } } = props;

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
};

export default DashboardContainer;
