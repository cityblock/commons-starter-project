import * as classNames from 'classnames';
import * as React from 'react';
import { Popup } from '../../popup/popup';
import ModalHeader from '../modal-header/modal-header';
import Spinner from '../spinner/spinner';
import * as styles from './css/photo-modal.css';
import PhotoModalButtons from './photo-modal-buttons';

interface IProps {
  isVisible: boolean;
  closePopup: () => void;
  onSave: (imgData: Blob) => void;
  showFaceOutline?: boolean;
}

interface IState {
  imgData: Blob | null;
  loading: boolean;
  error: string | null;
  stream: MediaStream | null;
  height: number;
  width: number;
}

const INITIAL_STATE: IState = {
  imgData: null,
  loading: false,
  error: null,
  stream: null,
  height: 0,
  width: 600,
};

class PhotoModal extends React.Component<IProps, IState> {
  video: HTMLVideoElement | null;
  canvas: HTMLCanvasElement | null;

  constructor(props: IProps) {
    super(props);
    this.state = INITIAL_STATE;
  }

  componentDidUpdate(prevProps: IProps): void {
    if (this.props.isVisible && !prevProps.isVisible) {
      navigator.getUserMedia(
        {
          video: true,
          audio: false,
        },
        stream => {
          if (this.video) {
            this.setState({ stream });
            const vendorURL = window.URL;
            this.video.src = vendorURL.createObjectURL(stream);
            this.video.play();
          }
        },
        err => {
          this.setState({ error: err.message });
        },
      );
    }
  }

  handleCanPlay = (): void => {
    if (this.video && this.canvas) {
      const newHeight = Math.floor(
        this.video.videoHeight / (this.video.videoWidth / this.state.width),
      );
      this.setState({ height: newHeight });

      const { height, width } = this.state;
      this.video.setAttribute('height', `${height}px`);
      this.video.setAttribute('width', `${width}px`);
      this.canvas.setAttribute('height', `${height}px`);
      this.canvas.setAttribute('width', `${width}px`);
    }
  };

  handleClose = (): void => {
    // stop video stream
    const { stream } = this.state;

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    this.setState(INITIAL_STATE);
    this.props.closePopup();
  };

  handleTakePhoto = (): void => {
    if (!this.canvas || !this.video) {
      this.setState({ error: 'Something went wrong. Please try again.' });
      return;
    }

    const { width, height } = this.state;

    if (width && height) {
      const context = this.canvas.getContext('2d');
      this.canvas.width = width;
      this.canvas.height = height;

      if (context) {
        context.drawImage(this.video, 0, 0, width, height);
      }

      this.canvas.toBlob(blob => {
        this.setState({ imgData: blob });
      }, 'image/png');
    }
  };

  handleRetakePhoto = (): void => {
    this.setState({ imgData: null });
  };

  handleSavePhoto = async (): Promise<void> => {
    const { imgData, loading } = this.state;

    if (!loading && imgData) {
      try {
        this.setState({ loading: true });
        await this.props.onSave(imgData);
        this.handleClose();
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    }
  };

  render(): JSX.Element {
    const { isVisible, showFaceOutline } = this.props;
    const { imgData, stream } = this.state;

    const videoStyles = classNames(styles.video, {
      [styles.hidden]: !!imgData,
    });

    const displayOutline = showFaceOutline && stream && !imgData;
    // cannot run URL.createObjectURL on null
    const imgSrc = imgData && URL.createObjectURL ? URL.createObjectURL(imgData) : (imgData as any);

    return (
      <Popup visible={isVisible} style="no-padding" className={styles.popup}>
        <ModalHeader closePopup={this.handleClose} titleMessageId="patientPhoto.popupTitle" />
        <div>
          {!stream && <Spinner className={styles.spinner} />}
          {displayOutline && <div className={styles.faceOutline} />}
          <video
            className={videoStyles}
            ref={video => (this.video = video)}
            onCanPlay={this.handleCanPlay}
          />
          <canvas className={styles.hidden} ref={canvas => (this.canvas = canvas)} />
          {imgData && <img src={imgSrc} alt="Member photo" />}
        </div>
        <PhotoModalButtons
          isPhotoTaken={!!imgData}
          onClose={this.handleClose}
          onTakePhoto={this.handleTakePhoto}
          onRetakePhoto={this.handleRetakePhoto}
          onSavePhoto={this.handleSavePhoto}
        />
      </Popup>
    );
  }
}

export default PhotoModal;
