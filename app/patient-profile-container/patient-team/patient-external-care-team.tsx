import * as React from 'react';

interface IProps {
  patientId: string;
}

export class PatientExternalCareTeam extends React.Component<IProps> {
  render(): JSX.Element {
    return <div>External Care Team</div>;
  }
}

export default PatientExternalCareTeam;
