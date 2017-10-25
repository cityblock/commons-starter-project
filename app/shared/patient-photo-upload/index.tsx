import * as React from 'react';
import * as styles from './patient-photo-upload.css';

interface IProps {
  onUploadPhotoClick: () => void;
  onTakePhotoClick: () => void;
}

export const PatientPhotoUpload: React.StatelessComponent<IProps> = props => (
  <div className={styles.container}>
    <div className={styles.patientPhoto} />
    <div className={styles.centerText}>
      Patient identification is very important to us. Uploading a patient photo will help our staff
      ensure the identity of the patient.
      <div className={styles.smallText}>Photo should be at least 300px x 300px.</div>
    </div>
    <div className={styles.rightButtonContainer}>
      <button className={styles.button} onClick={props.onTakePhotoClick}>
        Take Photo
      </button>
      <button className={styles.button} onClick={props.onUploadPhotoClick}>
        Upload Photo
      </button>
    </div>
  </div>
);
