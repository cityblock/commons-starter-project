import React from 'react';
import CarePlanSuggestionsPopup from '../shared/care-plan-suggestions/care-plan-suggestions';
import TaskUnfollowPopup from '../shared/task/unfollow-popup';
import PatientPhotoPopup from './patient-photo/patient-photo-popup';
import ScreeningToolsPopup from './screening-tool/screening-tools-popup';
import QuickCallPopup from './timeline/quick-call-popup';

const PatientModals: React.StatelessComponent = () => {
  return (
    <div>
      <QuickCallPopup />
      <ScreeningToolsPopup />
      <PatientPhotoPopup />
      <CarePlanSuggestionsPopup />
      <TaskUnfollowPopup />
    </div>
  );
};

export default PatientModals;
