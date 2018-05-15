import * as React from 'react';
import CarePlanSuggestionsPopup from '../shared/care-plan-suggestions/care-plan-suggestions';
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
    </div>
  );
};

export default PatientModals;
