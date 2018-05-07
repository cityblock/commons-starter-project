import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import * as progressNoteLatestForPatientQuery from '../../graphql/queries/get-progress-note-latest-for-patient.graphql';
import {
  getProgressNoteLatestForPatientQuery,
  FullPatientForProfileFragment,
} from '../../graphql/types';
import SmallText from '../../shared/library/small-text/small-text';
import { IState as IAppState } from '../../store';
import * as styles from './css/header.css';
import LeftNavHeaderPatient from './header-patient';
import PatientNeedToKnow from './patient-need-to-know';
import LeftNavPreferredName from './preferred-name';

export interface IProps {
  patient: FullPatientForProfileFragment | null;
}

interface IStateProps {
  isWidgetOpen: boolean;
}

interface IGraphqlProps {
  latestProgressNote: getProgressNoteLatestForPatientQuery['progressNoteLatestForPatient'];
}

type allProps = IProps & IStateProps & IGraphqlProps;

export const LeftNavHeader: React.StatelessComponent<allProps> = (props: allProps) => {
  const { patient, latestProgressNote, isWidgetOpen } = props;

  if (!patient) return null;

  const worryScore = latestProgressNote ? latestProgressNote.worryScore : null;

  const borderStyles = classNames(styles.border, {
    [styles.redBorder]: worryScore === 3,
    [styles.yellowBorder]: worryScore === 2,
    [styles.greenBorder]: worryScore === 1,
    [styles.smallBorder]: isWidgetOpen,
  });

  return (
    <div>
      <div className={borderStyles} />
      <LeftNavHeaderPatient patient={patient} isWidgetOpen={isWidgetOpen} />
      <div className={styles.container}>
        <div className={styles.needToKnow}>
          <div className={styles.divider} />
          <SmallText messageId="patientInfo.needToKnow" />
          <div className={styles.divider} />
        </div>
        <LeftNavPreferredName patient={patient} />
        <PatientNeedToKnow patientInfoId={patient.patientInfo.id} />
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState): IStateProps => {
  return {
    isWidgetOpen: !!state.patientLeftNav,
  };
};

export default compose(
  connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql(progressNoteLatestForPatientQuery as any, {
    skip: ({ patient }: IProps) => !patient,
    options: ({ patient }: IProps) => {
      const patientId = patient ? patient.id : '';

      return { variables: { patientId } };
    },
    props: ({ data }) => ({
      latestProgressNote: data ? (data as any).progressNoteLatestForPatient : null,
    }),
  }),
)(LeftNavHeader);
