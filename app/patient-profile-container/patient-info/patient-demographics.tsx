import { History } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import { getPatient } from '../../graphql/types';
import AdvancedDirectives, { IAdvancedDirectives } from './advanced-directives';
import BasicInfo, { IBasicInfo } from './basic-info';
import ContactInfo, { IContactInfo } from './contact-info';
import CoreIdentity, { ICoreIdentity } from './core-identity';
import styles from './css/patient-demographics.css';
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
  patientDemographics: IDemographics;
  routeBase: string;
  onChange: (fields: IEditableFieldState) => void;
  location: Location;
  history: History;
  patient?: getPatient['patient'];
}

type allProps = IProps & RouteComponentProps<IProps>;

export class PatientDemographics extends React.Component<allProps> {
  basic: React.Component<any> | null = null;
  photo: React.Component<any> | null = null;
  advancedDirectives: React.Component<any> | null = null;

  componentDidUpdate() {
    const { history, routeBase, location } = this.props;
    const hash = location.hash.replace('#', '');

    if (hash) {
      const node = (n => {
        switch (n) {
          case 'basic':
            return this.basic;
          case 'photo':
            return this.photo;
          case 'advancedDirectives':
            return this.advancedDirectives;
          default:
            return null;
        }
      })(hash);

      if (node) {
        // scrollIntoView is on all nodes https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
        (ReactDOM.findDOMNode(node) as any).scrollIntoView();
        history.push(routeBase);
      }
    }
  }

  render() {
    const { patientDemographics, patient, onChange, routeBase } = this.props;

    return (
      <div className={styles.container}>
        <CoreIdentity
          patientIdentity={patientDemographics.core}
          onChange={onChange}
          patientId={patientDemographics.patientId}
        />
        <BasicInfo
          patientInformation={patientDemographics.basic}
          onChange={onChange}
          patientId={patientDemographics.patientId}
          patientInfoId={patientDemographics.patientInfoId}
          ref={ref => (this.basic = ref)}
        />
        <ContactInfo
          contactInfo={patientDemographics.contact}
          patientId={patientDemographics.patientId}
          patientInfoId={patientDemographics.patientInfoId}
          onChange={onChange}
        />
        <PlanInfo
          planInfo={patientDemographics.plan}
          patientId={patientDemographics.patientId}
          patient={patient}
          onChange={onChange}
        />
        <AdvancedDirectives
          advancedDirectives={patientDemographics.advanced}
          patientId={patientDemographics.patientId}
          patientInfoId={patientDemographics.patientInfoId}
          onChange={onChange}
          routeBase={routeBase}
          ref={ref => (this.advancedDirectives = ref)}
        />
        <PatientPhoto
          patientPhoto={patientDemographics.photo}
          onChange={onChange}
          patientId={patientDemographics.patientId}
          patientInfoId={patientDemographics.patientInfoId}
          gender={patientDemographics.basic.gender}
          ref={ref => (this.photo = ref)}
        />
      </div>
    );
  }
}

export default withRouter(PatientDemographics);
