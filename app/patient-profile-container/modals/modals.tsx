import * as React from 'react';
import CreateGoalModal from '../../shared/concerns/create-goal/create-goal';
import CreateConcernModal from '../create-concern/create-concern';
import DeleteConcernModal from '../delete-concern/delete-concern';
import DeleteGoalModal from '../delete-goal/delete-goal';

const MapModals: React.StatelessComponent<{}> = () => (
  <div>
    <CreateGoalModal />
    <DeleteGoalModal />
    <CreateConcernModal />
    <DeleteConcernModal />
  </div>
);

export default MapModals;
