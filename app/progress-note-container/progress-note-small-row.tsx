import classNames from 'classnames';
import React from 'react';
import { FormattedTime } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router';
import { FullProgressNote } from '../graphql/types';
import PatientPhoto from '../shared/library/patient-photo/patient-photo';
import styles from './css/progress-note-small-row.css';

interface IProps {
  progressNote: FullProgressNote;
  currentUserId: string;
  onClick: (patientId: string) => void;
}

type allProps = IProps & RouteComponentProps<IProps>;

export class ProgressNoteSmallRow extends React.Component<allProps> {
  handleClick = (): void => {
    const {
      onClick,
      progressNote,
      location: { pathname },
      history,
    } = this.props;

    // if not currently on patient profile, redicrect to it
    const patientRoute = `/patients/${progressNote.patientId}`;

    if (!pathname.includes(patientRoute)) {
      history.push(`${patientRoute}/map/active`);
    }

    onClick(progressNote.id);
  };

  render(): JSX.Element {
    const { progressNote, currentUserId } = this.props;
    const name = progressNote.patient
      ? `${progressNote.patient.firstName} ${progressNote.patient.lastName}`
      : null;
    const formattedTime = progressNote.createdAt ? (
      <FormattedTime value={progressNote.createdAt} />
    ) : null;
    let title = progressNote.progressNoteTemplate ? progressNote.progressNoteTemplate.title : null;
    let titleStyles = styles.title;
    if (
      progressNote.needsSupervisorReview &&
      progressNote.supervisor &&
      progressNote.supervisor.id === currentUserId
    ) {
      title = 'Supervisor review';
      titleStyles = classNames(styles.title, styles.highlight);
    }

    const { gender, hasUploadedPhoto } = progressNote.patient.patientInfo;
    return (
      <div key={progressNote.id} className={styles.progressNote} onClick={this.handleClick}>
        <PatientPhoto
          patientId={progressNote.patient.id}
          gender={gender}
          hasUploadedPhoto={!!hasUploadedPhoto}
          type="circleLarge"
        />
        <div className={styles.progressNoteRight}>
          <div className={styles.patientName}>{name}</div>
          <div className={styles.bottomSection}>
            <div className={titleStyles}>{title}</div>
            <div className={styles.time}>{formattedTime}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProgressNoteSmallRow);
