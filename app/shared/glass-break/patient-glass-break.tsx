import { ApolloError } from 'apollo-client';
import { omit } from 'lodash';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import patientGlassBreakCheck from '../../graphql/queries/get-patient-glass-break-check.graphql';
import patientGlassBreaksForUser from '../../graphql/queries/get-patient-glass-breaks-for-user.graphql';
import createPatientGlassBreakGraphql from '../../graphql/queries/patient-glass-break-create-mutation.graphql';
import {
  getPatient,
  getPatientGlassBreaksForUser,
  getPatientGlassBreakCheck,
  patientGlassBreakCreate,
  patientGlassBreakCreateVariables,
} from '../../graphql/types';
import ErrorComponent from '../error-component/error-component';
import { formatPatientName } from '../helpers/format-helpers';
import Spinner from '../library/spinner/spinner';
import withCurrentUser, {
  IInjectedProps as ICurrentUserProps,
} from '../with-current-user/with-current-user';
import styles from './css/patient-glass-break.css';
import GlassBreak from './glass-break';

export interface IInjectedProps {
  glassBreakId: string | null;
}

interface IExternalProps {
  patient: getPatient['patient'];
  patientId: string;
  loading?: boolean;
  error?: ApolloError;
}

interface IGraphqlProps {
  loadingGlassBreakCheck: boolean;
  errorGlassBreakCheck: string | null;
  glassBreakCheck: getPatientGlassBreakCheck['patientGlassBreakCheck'];
  loadingGlassBreaks: boolean;
  errorGlassBreaks: string | null;
  glassBreaks: getPatientGlassBreaksForUser['patientGlassBreaksForUser'];
  createPatientGlassBreak: (
    options: { variables: patientGlassBreakCreateVariables },
  ) => { data: patientGlassBreakCreate };
}

const patientGlassBreak = () => <P extends {}>(
  Component:
    | React.ComponentClass<P & IInjectedProps>
    | React.StatelessComponent<P & IInjectedProps>,
) => {
  type IProps = P & IExternalProps & IInjectedProps & ICurrentUserProps;
  type resultProps = IProps & IGraphqlProps;

  class PatientGlassBreak extends React.Component<resultProps> {
    isLoading(): boolean {
      const { loading, loadingGlassBreakCheck, error, errorGlassBreakCheck } = this.props;
      return !!loading || !!loadingGlassBreakCheck || !!error || !!errorGlassBreakCheck;
    }

    getWrappedComponentProps() {
      return omit(this.props, [
        'loadingGlassBreakCheck',
        'errorGlassBreakCheck',
        'glassBreakCheck',
        'featureFlags',
        'currentUser',
        'glassBreaks',
        'loadingGlassBreaks',
        'errorGlassBreaks',
        'createPatientGlassBreak',
      ]);
    }

    getGlassBreakId(): string | null {
      const { glassBreaks, patientId } = this.props;
      const foundGlassBreak = (glassBreaks || []).find(
        glassBreak => glassBreak.patientId === patientId,
      );

      return foundGlassBreak ? foundGlassBreak.id : null;
    }

    createGlassBreak = async (reason: string, note: string | null) => {
      const { createPatientGlassBreak, patientId } = this.props;
      return createPatientGlassBreak({ variables: { patientId, reason, note } });
    };

    render(): JSX.Element {
      const { error } = this.props;
      if (error) {
        return <ErrorComponent error={error!} />;
      }
      if (this.isLoading()) return <Spinner className={styles.spinner} />;

      const { patient, featureFlags, glassBreakCheck } = this.props;
      const glassBreakId = this.getGlassBreakId();
      // render component if can auto break glass, don't need to break glass, or already broke glass
      if (featureFlags.canAutoBreakGlass || glassBreakCheck.isGlassBreakNotNeeded || glassBreakId) {
        return <Component {...this.getWrappedComponentProps()} glassBreakId={glassBreakId} />;
      }
      // otherwise render glass break screen
      return (
        <GlassBreak
          resource="patient"
          patientName={formatPatientName(patient)}
          createGlassBreak={this.createGlassBreak}
        />
      );
    }
  }

  return compose(
    withCurrentUser(),
    graphql(patientGlassBreakCheck, {
      options: (props: IProps) => ({
        variables: {
          patientId: props.patientId,
        },
        fetchPolicy: 'network-only',
      }),
      props: ({ data }) => ({
        loadingGlassBreakCheck: data ? data.loading : false,
        errorGlassBreakCheck: data ? data.error : null,
        glassBreakCheck: data ? (data as any).patientGlassBreakCheck : null,
      }),
    }),
    graphql(patientGlassBreaksForUser, {
      options: {
        fetchPolicy: 'network-only',
      },
      props: ({ data }) => ({
        loadingGlassBreaks: data ? data.loading : false,
        errorGlassBreaks: data ? data.error : null,
        glassBreaks: data ? (data as any).patientGlassBreaksForUser : null,
      }),
    }),
    graphql<IGraphqlProps, IProps, resultProps>(createPatientGlassBreakGraphql, {
      name: 'createPatientGlassBreak',
      options: {
        refetchQueries: ['getPatientGlassBreaksForUser'],
      },
    }),
  )(PatientGlassBreak);
};

export default patientGlassBreak;
