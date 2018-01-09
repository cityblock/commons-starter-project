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
      <DashboardNavigation selected={tab} tagId={tagId} />
      {rightPane}
    </div>
  );
};

export default DashboardContainer;
