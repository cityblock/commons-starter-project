import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
/* tslint:disable:max-line-length */
import * as patientCarePlanQuery from '../graphql/queries/get-patient-care-plan.graphql';
/* tslint:enable:max-line-length */
import { getPatientCarePlanQuery } from '../graphql/types';
import * as tabStyles from '../shared/css/tabs.css';
import * as styles from './css/patient-care-plan.css';
import PatientCarePlanSuggestions from './patient-care-plan-suggestions';
import PatientMap from './patient-map';

export interface IProps {
  patientId: string;
  subTabId?: 'active' | 'suggestions';
  routeBase: string;
}

interface IGraphqlProps {
  patientCarePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  refetchPatientCarePlan?: () => any;
  loading?: boolean;
  error?: string;
}

export const PatientCarePlanView = (props: IProps & IGraphqlProps) => {
  const { subTabId, routeBase, patientId, patientCarePlan, loading } = props;
  const isSuggestions = subTabId === 'suggestions';

  const carePlanSuggestions = isSuggestions ? (
    <PatientCarePlanSuggestions routeBase={routeBase} patientId={patientId} />
  ) : null;

  const carePlan = !isSuggestions ? (
    <PatientMap
      loading={loading}
      carePlan={patientCarePlan}
      routeBase={`${routeBase}/active`}
      patientId={patientId}
    />
  ) : null;

  const activeCarePlanTabStyles = classNames(tabStyles.tab, {
    [tabStyles.selectedTab]: !isSuggestions,
  });
  const suggestionsTabStyles = classNames(tabStyles.tab, {
    [tabStyles.selectedTab]: isSuggestions,
  });
  const tabRowStyles = classNames(tabStyles.tabs, tabStyles.darkTabs);

  return (
    <div>
      <div className={tabRowStyles}>
        <FormattedMessage id="patient.activeCarePlan">
          {(message: string) => (
            <Link to={`${routeBase}/active`} className={activeCarePlanTabStyles}>
              {message}
            </Link>
          )}
        </FormattedMessage>
        <FormattedMessage id="patient.carePlanSuggestions">
          {(message: string) => (
            <Link to={`${routeBase}/suggestions`} className={suggestionsTabStyles}>
              {message}
            </Link>
          )}
        </FormattedMessage>
      </div>
      <div className={styles.carePlanPanel}>
        {carePlanSuggestions}
        {carePlan}
      </div>
    </div>
  );
};

export default graphql<IGraphqlProps, IProps>(patientCarePlanQuery as any, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
    fetchPolicy: 'cache-and-network', // Always get the latest care plan
  }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    patientCarePlan: data ? (data as any).carePlanForPatient : null,
    refetchPatientCarePlan: data ? data.refetch : null,
  }),
})(PatientCarePlanView);
