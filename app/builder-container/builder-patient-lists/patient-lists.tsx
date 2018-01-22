import * as React from 'react';
import { FullPatientListFragment } from '../../graphql/types';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
import { ROUTE_BASE } from './builder-patient-lists';
import PatientList from './patient-list';

interface IProps {
  patientListId: string | null;
  patientLists: FullPatientListFragment[];
}

const PatientLists: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patientListId, patientLists } = props;

  if (!patientLists.length) {
    return <EmptyPlaceholder headerMessageId="patientLists.empty" icon="addBox" />;
  }

  const renderedPatientLists = patientLists.map(list => (
    <PatientList
      key={list.id}
      patientList={list}
      selected={list.id === patientListId}
      routeBase={ROUTE_BASE}
    />
  ));

  return <div>{renderedPatientLists}</div>;
};

export default PatientLists;
