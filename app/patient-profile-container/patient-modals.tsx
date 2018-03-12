import * as React from 'react';
import ScreeningToolsPopup from './screening-tool/screening-tools-popup';
import QuickCallPopup from './timeline/quick-call-popup';

const PatientModals: React.StatelessComponent = () => {
  return (
    <div>
      <QuickCallPopup />
      <ScreeningToolsPopup />
    </div>
  );
};

export default PatientModals;
