import { omit } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as patientGlassBreakCheckQuery from '../../graphql/queries/get-patient-glass-break-check.graphql';
import * as patientGlassBreaksForUserQuery from '../../graphql/queries/get-patient-glass-breaks-for-user.graphql';
import * as createPatientGlassBreakMutationGraphql from '../../graphql/queries/patient-glass-break-create-mutation.graphql';
import {
  getPatientGlassBreaksForUserQuery,
  getPatientGlassBreakCheckQuery,
  getPatientQuery,
  patientGlassBreakCreateMutation,
  patientGlassBreakCreateMutationVariables,
} from '../../graphql/types';
import { formatPatientName } from '../helpers/format-helpers';
import Spinner from '../library/spinner/spinner';
import withCurrentUser, {
  IInjectedProps as ICurrentUserProps,
} from '../with-current-user/with-current-user';
import * as styles from './css/patient-glass-break.css';
import GlassBreak from './glass-break';

export interface IInjectedProps {
  glassBreakId: string | null;
}

interface IExternalProps {
  patient: getPatientQuery['patient'];
  patientId: string;
  loading?: boolean;
  error?: string | null;
}

interface IGraphqlProps {
  loadingGlassBreakCheck: boolean;
  errorGlassBreakCheck: string | null;
  glassBreakCheck: getPatientGlassBreakCheckQuery['patientGlassBreakCheck'];
  loadingGlassBreaks: boolean;
  errorGlassBreaks: string | null;
  glassBreaks: getPatientGlassBreaksForUserQuery['patientGlassBreaksForUser'];
  createPatientGlassBreak: (
    options: { variables: patientGlassBreakCreateMutationVariables },
  ) => { data: patientGlassBreakCreateMutation };
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
      const {
        loading,
        loadingGlassBreakCheck,
        loadingGlassBreaks,
        error,
        errorGlassBreakCheck,
        errorGlassBreaks,
      } = this.props;
      return (
        !!loading ||
        !!loadingGlassBreakCheck ||
        !!error ||
        !!errorGlassBreakCheck ||
        !!loadingGlassBreaks ||
        !!errorGlassBreaks
      );
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
      const foundGlassBreak = glassBreaks.find(glassBreak => glassBreak.patientId === patientId);

      return foundGlassBreak ? foundGlassBreak.id : null;
    }

    createGlassBreak = async (reason: string, note: string | null) => {
      const { createPatientGlassBreak, patientId } = this.props;
      return createPatientGlassBreak({ variables: { patientId, reason, note } });
    }

    render(): JSX.Element {
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
    graphql<IGraphqlProps, IProps, resultProps>(patientGlassBreakCheckQuery as any, {
      options: (props: IProps) => ({
        variables: {
          patientId: props.patientId,
        },
      }),
      props: ({ data }) => ({
        loadingGlassBreakCheck: data ? data.loading : false,
        errorGlassBreakCheck: data ? data.error : null,
        glassBreakCheck: data ? (data as any).patientGlassBreakCheck : null,
      }),
    }),
    graphql<IGraphqlProps, IProps, resultProps>(patientGlassBreaksForUserQuery as any, {
      props: ({ data }) => ({
        loadingGlassBreaks: data ? data.loading : false,
        errorGlassBreaks: data ? data.error : null,
        glassBreaks: data ? (data as any).patientGlassBreaksForUser : null,
      }),
    }),
    graphql<IGraphqlProps, IProps, resultProps>(createPatientGlassBreakMutationGraphql as any, {
      name: 'createPatientGlassBreak',
      options: {
        refetchQueries: ['getPatientGlassBreaksForUser'],
      },
    }),
  )(PatientGlassBreak);
};

export default patientGlassBreak;
