import * as React from 'react';
import * as styles from './css/dashboard-container.css';
import DashboardPatients from './dashboard-patients';
import DashboardNavigation from './navigation/navigation';

export type Selected = 'tasks' | 'new' | 'suggestions' | 'tag';

interface IProps {
  match: {
    params: {
      list: Selected;
      tagId?: string;
    };
  };
}

const DashboardContainer: React.StatelessComponent<IProps> = (props: IProps) => {
  const { match: { params: { list, tagId } } } = props;

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <DashboardNavigation selected={list} tagId={tagId} />
      </div>
      <div className={styles.rightPane}>
        <DashboardPatients selected={list} tagId={tagId} />
      </div>
    </div>
  );
};

export default DashboardContainer;
