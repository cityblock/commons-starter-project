import * as React from 'react';
import AddProgressNote from './add-progress-note';
import LeftNavQuickAction from './left-nav-quick-action';

interface IProps {
  patientId: string;
  glassBreakId: string | null;
}

const LeftNavQuickActions: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patientId } = props;

  return (
    <div>
      <AddProgressNote patientId={patientId} />
      <LeftNavQuickAction quickAction="addQuickCall" onClick={() => true as any} />
      <LeftNavQuickAction quickAction="administerTool" onClick={() => true as any} />
      <LeftNavQuickAction quickAction="viewDocuments" onClick={() => true as any} />
      <LeftNavQuickAction quickAction="openFormLibrary" onClick={() => true as any} />
    </div>
  );
};

export default LeftNavQuickActions;
