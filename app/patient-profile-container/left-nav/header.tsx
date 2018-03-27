import * as classNames from 'classnames';
import { capitalize } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as progressNoteLatestForPatientQuery from '../../graphql/queries/get-progress-note-latest-for-patient.graphql';
import {
  getProgressNoteLatestForPatientQuery,
  FullPatientForProfileFragment,
} from '../../graphql/types';
import { formatAge, formatPatientNameForProfile } from '../../shared/helpers/format-helpers';
import PatientPhoto from '../../shared/library/patient-photo/patient-photo';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/header.css';
import PatientNeedToKnow from './patient-need-to-know';
import LeftNavPreferredName from './preferred-name';

interface IProps {
  patient: FullPatientForProfileFragment | null;
}

interface IGraphqlProps {
  latestProgressNote: getProgressNoteLatestForPatientQuery['progressNoteLatestForPatient'];
}

type allProps = IProps & IGraphqlProps;

export const LeftNavHeader: React.StatelessComponent<allProps> = (props: allProps) => {
  const { patient, latestProgressNote } = props;

  if (!patient) return null;

  const hasUploadedPhoto = !!patient.patientInfo.hasUploadedPhoto;
  const gender = patient.patientInfo.gender;
  const worryScore = latestProgressNote ? latestProgressNote.worryScore : null;

  const containerStyles = classNames(styles.container, {
    [styles.redBorder]: worryScore === 3,
    [styles.yellowBorder]: worryScore === 2,
    [styles.greenBorder]: worryScore === 1,
  });

  return (
    <div className={containerStyles}>
      <div className={styles.info}>
        <PatientPhoto patientId={patient.id} hasUploadedPhoto={hasUploadedPhoto} gender={gender} />
        <div className={styles.patient}>
          <SmallText
            text={capitalize(patient.patientState.currentState)}
            color="green"
            size="medium"
            isBold
          />
          <h1>{formatPatientNameForProfile(patient)}</h1>
          <SmallText
            messageId="patientInfo.age"
            messageValues={{ age: formatAge(patient.dateOfBirth) }}
            size="large"
            color="black"
            isBold
          />
        </div>
      </div>
      <div className={styles.needToKnow}>
        <div className={styles.divider} />
        <SmallText messageId="patientInfo.needToKnow" />
        <div className={styles.divider} />
      </div>
      <LeftNavPreferredName patient={patient} />
      <PatientNeedToKnow patientId={patient.id} />
    </div>
  );
};

export default graphql<IGraphqlProps, IProps, allProps>(progressNoteLatestForPatientQuery as any, {
  skip: ({ patient }: IProps) => !patient,
  options: ({ patient }: IProps) => {
    const patientId = patient ? patient.id : '';

    return { variables: { patientId } };
  },
  props: ({ data }) => ({
    latestProgressNote: data ? (data as any).progressNoteLatestForPatient : null,
  }),
})(LeftNavHeader);
