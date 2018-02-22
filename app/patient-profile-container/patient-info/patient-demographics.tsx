import * as React from 'react';
import BasicInformation, { IBasicInformation } from './basic-information';
import CoreIdentity, { ICoreIdentity } from './core-identity';
import * as styles from './css/patient-demographics.css';

export interface IDemographics {
  core: ICoreIdentity;
  basic: IBasicInformation;
}

interface IProps {
  patient: IDemographics;
  routeBase: string;
  onChange: (field: { name: string; value: string | object | boolean | null }) => void;
}

class PatientDemographics extends React.Component<IProps> {
  render() {
    const { patient, onChange } = this.props;

    return (
      <div className={styles.container}>
        <CoreIdentity patientIdentity={patient.core} onChange={onChange} />
        <BasicInformation patientInformation={patient.basic} onChange={onChange} />
      </div>
    );
  }
}

export default PatientDemographics;
