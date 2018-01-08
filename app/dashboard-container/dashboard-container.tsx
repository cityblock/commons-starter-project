import * as React from 'react';
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

  return (
    <div>
      <DashboardNavigation selected={tab} tagId={tagId} />
    </div>
  );
};

export default DashboardContainer;
