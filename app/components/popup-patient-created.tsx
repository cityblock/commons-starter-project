import * as React from 'react';
import { Link } from 'react-router-dom';
import * as styles from '../css/components/popup-patient-created.css';
import { ShortPatientFragment } from '../graphql/types';
import Popup from './popup';

export interface IProps {
  patient?: ShortPatientFragment;
}

class PopupPatientCreated extends React.Component<IProps, {}> {

  render() {
    const { patient } = this.props;
    const visible = patient ? true : false;
    const name = patient ? `${patient.firstName} ${patient.lastName}` : null;
    const patientLink = patient ? `/patients/${patient.id}` : '';
    return (
      <Popup visible={visible}>
        <div className={styles.content}>
          <div className={styles.heading}>
            {name} <span className={styles.highlight}>successfully</span> enrolled
          </div>
          <div className={styles.paragraph}>
            Continue to their patient profile or go back to your patient roster.
          </div>
          <div className={styles.buttonContainer}>
            <Link className={styles.invertedButton} to={'/patients'}>Patient Roster</Link>
            <Link className={styles.button} to={patientLink}>Go to profile</Link>
          </div>
        </div>
      </Popup>);
  }
}

export default PopupPatientCreated;
