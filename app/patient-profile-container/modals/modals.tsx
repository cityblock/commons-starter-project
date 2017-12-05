import * as React from 'react';
import CreateGoalModal from '../../shared/concerns/create-goal/create-goal';
import DeleteGoalModal from '../delete-goal/delete-goal';

const MapModals: React.StatelessComponent<{}> = () => (
  <div>
    <CreateGoalModal />
    <DeleteGoalModal />
  </div>
);

export default MapModals;
