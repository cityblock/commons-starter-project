import React from 'react';
import CreateGoalModal from '../../shared/concerns/create-goal/create-goal';
import CreateConcernModal from '../create-concern/create-concern';
import DeleteConcernModal from '../delete-concern/delete-concern';
import DeleteGoalModal from '../delete-goal/delete-goal';

interface IProps {
  refetchCarePlan: () => Promise<any>;
  patientId: string;
}

const MapModals: React.StatelessComponent<IProps> = (props: IProps) => (
  <React.Fragment>
    <CreateGoalModal refetchCarePlan={props.refetchCarePlan} patientId={props.patientId} />
    <DeleteGoalModal refetchCarePlan={props.refetchCarePlan} />
    <CreateConcernModal refetchCarePlan={props.refetchCarePlan} patientId={props.patientId} />
    <DeleteConcernModal refetchCarePlan={props.refetchCarePlan} />
  </React.Fragment>
);

export default MapModals;
