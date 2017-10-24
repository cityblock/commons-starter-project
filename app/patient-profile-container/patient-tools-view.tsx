import * as React from 'react';
import ScreeningTool from './screening-tool';

interface IProps {
  screeningToolId?: string;
  patientId: string;
  routeBase: string;
  patientRoute: string;
}

export const PatientToolsView: React.StatelessComponent<IProps> = props => {
  const { patientId, screeningToolId, routeBase, patientRoute } = props;

  const screeningTools = !screeningToolId ?
    <div>TBD!</div> : null;

  const screeningTool = screeningToolId ?
    <ScreeningTool
      routeBase={routeBase}
      patientRoute={patientRoute}
      screeningToolId={screeningToolId}
      patientId={patientId} /> : null;

  return (
    <div>
      {screeningTools}
      {screeningTool}
    </div>
  );
};
