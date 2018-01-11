import * as React from 'react';
import * as styles from './css/dashboard-container.css';
import DashboardTasksContainer from './dashboard-tasks-container';
import DashboardNavigation from './navigation/navigation';

export type Selected = 'tasks' | 'team' | 'suggestions' | 'tag';

interface IProps {
  match: {
    params: {
      tab: Selected;
      tagId?: string;
    };
  };
}

const DashboardContainer: React.StatelessComponent<IProps> = (props: IProps) => {
  const { match: { params: { tab, tagId } } } = props;
  let rightPane = null;

  if (tab === 'tasks') {
    rightPane = <DashboardTasksContainer />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <DashboardNavigation selected={tab} tagId={tagId} />
      </div>
      <div className={styles.rightPane}>{rightPane}</div>
    </div>
  );
};

export default DashboardContainer;
