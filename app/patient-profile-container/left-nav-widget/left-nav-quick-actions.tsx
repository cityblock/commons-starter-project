import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import AddProgressNote from './add-progress-note';
import AddQuickCall from './add-quick-call';
import AdministerScreeningTool from './administer-screening-tool';
import LeftNavQuickAction from './left-nav-quick-action';

interface IProps {
  patientId: string;
  glassBreakId: string | null;
  onClose: () => void;
}

type allProps = IProps & RouteComponentProps<IProps>;

export const LeftNavQuickActions: React.StatelessComponent<allProps> = (props: allProps) => {
  const { patientId, onClose } = props;

  // TODO: hook up this button
  const openFormsLibrary = () => window.open(process.env.FORMS_LIBRARY_URL, '_blank');

  const redirectToDocuments = () =>
    props.history.push(`/patients/${patientId}/member-info/documents`);

  return (
    <div>
      <AddProgressNote patientId={patientId} onClose={onClose} />
      <AddQuickCall patientId={patientId} onClose={onClose} />
      <AdministerScreeningTool patientId={patientId} onClose={onClose} />
      <LeftNavQuickAction
        quickAction="viewDocuments"
        onClick={redirectToDocuments}
        onClose={onClose}
      />
      <LeftNavQuickAction
        quickAction="openFormLibrary"
        onClick={openFormsLibrary}
        onClose={onClose}
      />
    </div>
  );
};

export default withRouter(LeftNavQuickActions);
