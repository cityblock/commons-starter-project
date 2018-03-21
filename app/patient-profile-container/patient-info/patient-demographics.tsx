import { History } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { withRouter, RouteComponentProps } from 'react-router';
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
  location: Location;
  history: History;
}

type allProps = IProps & RouteComponentProps<IProps>;

export class PatientDemographics extends React.Component<allProps> {
  componentDidUpdate() {
    const { history, routeBase, location } = this.props;
    const hash = location.hash.replace('#', '');

    if (hash) {
      const node = ReactDOM.findDOMNode(this.refs[hash]);

      if (node) {
        node.scrollIntoView();
        history.push(routeBase);
      }
    }
  }

  render() {
    const { patient, onChange, routeBase } = this.props;

    return (
      <div className={styles.container}>
        <CoreIdentity patientIdentity={patient.core} onChange={onChange} />
        <BasicInfo patientInformation={patient.basic} onChange={onChange} ref="basic" />
        <ContactInfo contactInfo={patient.contact} onChange={onChange} />
        <AdvancedDirectives
          advancedDirectives={patient.advanced}
          onChange={onChange}
          routeBase={routeBase}
          ref="advancedDirectives"
        />
        <PatientPhoto
          patientPhoto={patient.photo}
          onChange={onChange}
          patientId={patient.basic.patientId}
          patientInfoId={patient.basic.patientInfoId}
          gender={patient.basic.gender}
          ref="photo"
        />
      </div>
    );
  }
}

export default withRouter(PatientDemographics);
