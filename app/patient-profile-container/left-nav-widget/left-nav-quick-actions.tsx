import * as React from 'react';
import AddProgressNote from './add-progress-note';
import AddQuickCall from './add-quick-call';
import AdministerScreeningTool from './administer-screening-tool';
import LeftNavQuickAction from './left-nav-quick-action';

interface IProps {
  patientId: string;
  glassBreakId: string | null;
  onClose: () => void;
}

const LeftNavQuickActions: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patientId, onClose } = props;

  return (
    <div>
      <AddProgressNote patientId={patientId} onClose={onClose} />
      <AddQuickCall patientId={patientId} onClose={onClose} />
      <AdministerScreeningTool patientId={patientId} onClose={onClose} />
      <LeftNavQuickAction quickAction="viewDocuments" onClick={jest.fn()} onClose={onClose} />
      <LeftNavQuickAction quickAction="openFormLibrary" onClick={jest.fn()} onClose={onClose} />
    </div>
  );
};

export default LeftNavQuickActions;
