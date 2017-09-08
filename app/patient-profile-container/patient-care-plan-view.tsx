import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { ICarePlan } from 'schema';
/* tslint:disable:max-line-length */
import * as patientCarePlanQuery from '../graphql/queries/get-patient-care-plan.graphql';
/* tslint:enable:max-line-length */
import * as tabStyles from '../shared/css/tabs.css';
import * as styles from './css/patient-care-plan.css';
import PatientCarePlan from './patient-care-plan';
import PatientCarePlanSuggestions from './patient-care-plan-suggestions';

export interface IProps {
  patientId: string;
  subTabId?: 'active' | 'inactive' | 'suggestions';
  routeBase: string;
  patientCarePlan?: ICarePlan;
  refetchPatientCarePlan?: () => any;
  loading?: boolean;
  error?: string;
}

const PatientCarePlanView = (props: IProps) => {
  const { subTabId, routeBase, patientId, patientCarePlan, loading } = props;

  const carePlanSuggestions = subTabId === 'suggestions' ?
    <PatientCarePlanSuggestions routeBase={routeBase} patientId={patientId} /> : null;

  const carePlan = !subTabId || subTabId === 'inactive' || subTabId === 'active' ?
    (<PatientCarePlan
        loading={loading}
        carePlan={patientCarePlan}
        routeBase={routeBase}
        displayType={subTabId}
        patientId={patientId} />) : null;

  const activeCarePlanTabStyles = classNames(tabStyles.tab, {
    [tabStyles.selectedTab]: !subTabId || subTabId === 'active',
  });
  const inactiveCarePlanTabStyles = classNames(tabStyles.tab, {
    [tabStyles.selectedTab]: subTabId === 'inactive',
  });
  const suggestionsTabStyles = classNames(tabStyles.tab, {
    [tabStyles.selectedTab]: subTabId === 'suggestions',
  });
  const tabRowStyles = classNames(tabStyles.tabs, tabStyles.darkTabs);

  return (
    <div>
      <div className={tabRowStyles}>
        <FormattedMessage id='patient.activeCarePlan'>
          {(message: string) =>
            <Link
              to={`${routeBase}/active`}
              className={activeCarePlanTabStyles}>
              {message}
            </Link>}
        </FormattedMessage>
        <FormattedMessage id='patient.inactiveCarePlan'>
          {(message: string) =>
            <Link
              to={`${routeBase}/inactive`}
              className={inactiveCarePlanTabStyles}>
              {message}
            </Link>}
        </FormattedMessage>
        <FormattedMessage id='patient.carePlanSuggestions'>
          {(message: string) =>
            <Link
              to={`${routeBase}/suggestions`}
              className={suggestionsTabStyles}>
              {message}
            </Link>}
        </FormattedMessage>
      </div>
      <div className={styles.carePlanPanel}>
        {carePlanSuggestions}
        {carePlan}
      </div>
    </div>
  );
};

export default graphql(patientCarePlanQuery as any, {
  options: (props: IProps) => ({
    variables:  {
      patientId: props.patientId,
    },
    fetchPolicy: 'cache-and-network', // Always get the latest care plan
  }),
  props: ({ data }) => ({
    loading: (data ? data.loading : false),
    error: (data ? data.error : null),
    patientCarePlan: (data ? (data as any).carePlanForPatient : null),
    refetchPatientCarePlan: (data ? data.refetch : null),
  }),
})(PatientCarePlanView);
