import * as React from 'react';
import BasicInformation, { IBasicInformation } from './basic-information';
import ContactInfo, { IContactInfo } from './contact-info';
import CoreIdentity, { ICoreIdentity } from './core-identity';
import * as styles from './css/patient-demographics.css';
import { IEditableFieldState } from './patient-info';

export interface IDemographics {
  core: ICoreIdentity;
  basic: IBasicInformation;
  contact: IContactInfo;
}

interface IProps {
  patient: IDemographics;
  routeBase: string;
  onChange: (fields: IEditableFieldState) => void;
}

class PatientDemographics extends React.Component<IProps> {
  render() {
    const { patient, onChange } = this.props;

    return (
      <div className={styles.container}>
        <CoreIdentity patientIdentity={patient.core} onChange={onChange} />
        <BasicInformation patientInformation={patient.basic} onChange={onChange} />
        <ContactInfo contactInfo={patient.contact} onChange={onChange} />
      </div>
    );
  }
}

export default PatientDemographics;
