import * as React from 'react';
import LeftNavQuickAction from './left-nav-quick-action';

interface IProps {
  patientId: string;
  glassBreakId: string | null;
}

const LeftNavQuickActions: React.StatelessComponent<IProps> = (props: IProps) => {
  return (
    <div>
      <LeftNavQuickAction quickAction="addProgressNote" onClick={() => true as any} />
      <LeftNavQuickAction quickAction="addQuickCall" onClick={() => true as any} />
      <LeftNavQuickAction quickAction="administerTool" onClick={() => true as any} />
      <LeftNavQuickAction quickAction="viewDocuments" onClick={() => true as any} />
      <LeftNavQuickAction quickAction="openFormLibrary" onClick={() => true as any} />
    </div>
  );
};

export default LeftNavQuickActions;
