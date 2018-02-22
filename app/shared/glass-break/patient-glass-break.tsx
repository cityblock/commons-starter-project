import { omit } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as patientGlassBreakCheckQuery from '../../graphql/queries/get-patient-glass-break-check.graphql';
import { getPatientGlassBreakCheckQuery, getPatientQuery } from '../../graphql/types';
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
      ]);
    }

    render(): JSX.Element {
      if (this.isLoading()) return <Spinner className={styles.spinner} />;

      const { patient, featureFlags, glassBreakCheck } = this.props;

      // render component if can auto break glass or don't need to break glass
      if (featureFlags.canAutoBreakGlass || glassBreakCheck.isGlassBreakNotNeeded) {
        return <Component {...this.getWrappedComponentProps()} glassBreakId={null} />;
      }
      // otherwise render glass break screen
      return <GlassBreak resource="patient" patientName={formatPatientName(patient)} />;
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
  )(PatientGlassBreak);
};

export default patientGlassBreak;
