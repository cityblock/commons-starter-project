import * as React from 'react';
import AdvancedDirectives, { IAdvancedDirectives } from './advanced-directives';
import BasicInfo, { IBasicInfo } from './basic-info';
import ContactInfo, { IContactInfo } from './contact-info';
import CoreIdentity, { ICoreIdentity } from './core-identity';
import * as styles from './css/patient-demographics.css';
import { IEditableFieldState } from './patient-info';
import PatientPhoto, { IPatientPhoto } from './patient-photo';

export interface IDemographics {
  core: ICoreIdentity;
  basic: IBasicInfo;
  contact: IContactInfo;
  advanced: IAdvancedDirectives;
  photo: IPatientPhoto;
}

interface IProps {
  patient: IDemographics;
  routeBase: string;
  onChange: (fields: IEditableFieldState) => void;
}

class PatientDemographics extends React.Component<IProps> {
  render() {
    const { patient, onChange, routeBase } = this.props;

    return (
      <div className={styles.container}>
        <CoreIdentity patientIdentity={patient.core} onChange={onChange} />
        <BasicInfo patientInformation={patient.basic} onChange={onChange} />
        <ContactInfo contactInfo={patient.contact} onChange={onChange} />
        <AdvancedDirectives
          advancedDirectives={patient.advanced}
          onChange={onChange}
          routeBase={routeBase}
        />
        <PatientPhoto patientPhoto={patient.photo} onChange={onChange} />
      </div>
    );
  }
}

export default PatientDemographics;
