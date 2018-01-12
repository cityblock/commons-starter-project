import * as React from 'react';
import * as styles from './css/dashboard-container.css';
import DashboardPatientsContainer from './dashboard-patients-container';
import DashboardNavigation from './navigation/navigation';

export type Selected = 'tasks' | 'new' | 'suggestions' | 'tag';

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

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <DashboardNavigation selected={tab} tagId={tagId} />
      </div>
      <div className={styles.rightPane}>
        <DashboardPatientsContainer selected={tab} tagId={tagId} />
      </div>
    </div>
  );
};

export default DashboardContainer;
