import * as React from 'react';
import ModalButtons from '../modal-buttons/modal-buttons';
import * as styles from './css/photo-modal-buttons.css';

interface IProps {
  isPhotoTaken: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onRetakePhoto: () => void;
  onSavePhoto: () => void;
}

const PhotoModalButtons: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isPhotoTaken, onClose, onTakePhoto, onRetakePhoto, onSavePhoto } = props;

  if (isPhotoTaken) {
    return (
      <div className={styles.container}>
        <ModalButtons
          cancelMessageId="patientPhoto.retakePhoto"
          cancel={onRetakePhoto}
          submitMessageId="patientPhoto.savePhoto"
          submit={onSavePhoto}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ModalButtons
        cancel={onClose}
        submitMessageId="patientPhoto.takePhoto"
        submit={onTakePhoto}
      />
    </div>
  );
};

export default PhotoModalButtons;