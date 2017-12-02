import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { openPopup } from '../actions/popup-action';
/* tslint:disable:max-line-length */
import * as patientCarePlanQuery from '../graphql/queries/get-patient-care-plan.graphql';
/* tslint:enable:max-line-length */
import { getPatientCarePlanQuery } from '../graphql/types';
import * as tabStyles from '../shared/css/tabs.css';
import Button from '../shared/library/button/button';
import CreateConcernModal from './create-concern/create-concern';
import * as styles from './css/patient-care-plan.css';
import PatientCarePlanSuggestions from './patient-care-plan-suggestions';
import PatientMap from './patient-map';

type SelectableTabs = 'active' | 'suggestions';

interface IProps {
  match: {
    params: {
      patientId: string;
      subTab?: SelectableTabs;
      taskId?: string;
    };
  };
}

interface IGraphqlProps {
  patientCarePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  refetchPatientCarePlan?: () => any;
  loading?: boolean;
  error?: string;
}

interface IDispatchProps {
  addConcern: () => void;
}

export type allProps = IProps & IDispatchProps & IGraphqlProps;

export class PatientCarePlanView extends React.Component<allProps> {
  render(): JSX.Element {
    const { patientCarePlan, loading, match, addConcern } = this.props;
    const patientId = match.params.patientId;
    const subTab = match.params.subTab;
    const routeBase = `/patients/${match.params.patientId}/map`;
    const taskId = match.params.taskId;

    const isSuggestions = subTab === 'suggestions';

    const carePlanSuggestions = isSuggestions ? (
      <PatientCarePlanSuggestions routeBase={routeBase} patientId={patientId} />
    ) : null;
    const carePlan = !isSuggestions ? (
      <PatientMap
        loading={loading}
        carePlan={patientCarePlan}
        routeBase={`${routeBase}/active`}
        patientId={patientId}
        taskId={taskId}
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
          <Button messageId="concernCreate.addConcern" onClick={addConcern} />
        </div>
        <div className={styles.carePlanPanel}>
          {carePlanSuggestions}
          {carePlan}
        </div>
        <CreateConcernModal />
      </div>
    );
  }
}

const getPatientId = (props: IProps): string => props.match.params.patientId;

const mapDispatchToProps = (dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps => {
  const addConcern = () =>
    dispatch(
      openPopup({
        name: 'CREATE_PATIENT_CONCERN',
        options: { patientId: getPatientId(ownProps) },
      }),
    );

  return { addConcern };
};

export default compose(
  connect<{}, IDispatchProps, IProps>(null, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(patientCarePlanQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: getPatientId(props),
      },
      fetchPolicy: 'cache-and-network', // Always get the latest care plan
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patientCarePlan: data ? (data as any).carePlanForPatient : null,
      refetchPatientCarePlan: data ? data.refetch : null,
    }),
  }),
)(PatientCarePlanView);
