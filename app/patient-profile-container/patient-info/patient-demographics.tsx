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
import PlanInfo, { IPlanInfo } from './plan-info';

export interface IDemographics {
  core: ICoreIdentity;
  basic: IBasicInfo;
  contact: IContactInfo;
  plan: IPlanInfo;
  advanced: IAdvancedDirectives;
  photo: IPatientPhoto;
  patientId: string;
  patientInfoId: string;
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
        // scrollIntoView is on all nodes https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
        (node as any).scrollIntoView();
        history.push(routeBase);
      }
    }
  }

  render() {
    const { patient, onChange, routeBase } = this.props;

    return (
      <div className={styles.container}>
        <CoreIdentity
          patientIdentity={patient.core}
          onChange={onChange}
          patientId={patient.patientId}
        />
        <BasicInfo
          patientInformation={patient.basic}
          onChange={onChange}
          patientId={patient.patientId}
          patientInfoId={patient.patientInfoId}
          ref="basic"
        />
        <ContactInfo
          contactInfo={patient.contact}
          patientId={patient.patientId}
          patientInfoId={patient.patientInfoId}
          onChange={onChange}
        />
        <PlanInfo planInfo={patient.plan} patientId={patient.patientId} onChange={onChange} />
        <AdvancedDirectives
          advancedDirectives={patient.advanced}
          patientId={patient.patientId}
          patientInfoId={patient.patientInfoId}
          onChange={onChange}
          routeBase={routeBase}
          ref="advancedDirectives"
        />
        <PatientPhoto
          patientPhoto={patient.photo}
          onChange={onChange}
          patientId={patient.patientId}
          patientInfoId={patient.patientInfoId}
          gender={patient.basic.gender}
          ref="photo"
        />
      </div>
    );
  }
}

export default withRouter(PatientDemographics);
