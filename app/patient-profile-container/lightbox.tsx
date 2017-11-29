import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/lightbox.css';

interface IProps {
  images: string[];
  isOpen: boolean;
  openingImage?: string;
  onDismiss: () => any;
}

interface IState {
  selectedImageIndex: number;
  imagesLength?: number;
}

export default class Lightbox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onBackClick = this.onBackClick.bind(this);
    this.onNextClick = this.onNextClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    const { openingImage, images } = props;

    const selectedImageIndex = this.getOpeningImageIndex(openingImage, images);

    this.state = { selectedImageIndex };
  }

  componentWillUnmount() {
    // TODO: maybe overkill?
    document.removeEventListener('keydown', this.onKeyDown as any);
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { images, isOpen, openingImage } = nextProps;

    if (isOpen) {
      document.addEventListener('keydown', this.onKeyDown as any);

      const selectedImageIndex = this.getOpeningImageIndex(openingImage, images);
      this.setState({ imagesLength: images.length, selectedImageIndex });
    } else {
      document.removeEventListener('keydown', this.onKeyDown as any);
    }
  }

  getOpeningImageIndex(openingImage: string | undefined, imagesList: string[]) {
    let foundIndex: number = 0;

    if (openingImage) {
      foundIndex = imagesList.indexOf(openingImage);
    }

    return foundIndex === -1 ? 0 : foundIndex;
  }

  onBackClick() {
    const { selectedImageIndex } = this.state;

    if (selectedImageIndex > 0) {
      this.setState({ selectedImageIndex: selectedImageIndex - 1 });
    }
  }

  onNextClick() {
    const { selectedImageIndex } = this.state;
    const { images } = this.props;
    const imagesLength = images.length;

    if (selectedImageIndex < imagesLength - 1) {
      this.setState({ selectedImageIndex: selectedImageIndex + 1 });
    }
  }

  onKeyDown(event: React.KeyboardEvent<KeyboardEvent>) {
    const { onDismiss } = this.props;

    if (event.keyCode === 27) {
      // Esc pressed
      onDismiss();
    } else if (event.keyCode === 37) {
      // Left arrow pressed
      this.onBackClick();
    } else if (event.keyCode === 39) {
      // Right arrow pressed
      this.onNextClick();
    }
  }

  render() {
    const { selectedImageIndex } = this.state;
    const { isOpen, images, onDismiss } = this.props;
    const imagesLength = images.length;

    const backArrowStyles = classNames(styles.backArrow, {
      [styles.hidden]: selectedImageIndex === 0,
    });

    const nextArrowStyles = classNames(styles.nextArrow, {
      [styles.hidden]: selectedImageIndex + 1 === imagesLength,
    });

    const lightboxStyles = classNames(styles.lightbox, { [styles.hidden]: !isOpen });

    const selectedImage = images[selectedImageIndex];
    const pluralImageText = imagesLength !== 1;

    return (
      <div className={lightboxStyles}>
        <div className={styles.background} onClick={onDismiss} />
        <div className={styles.foreground}>
          <div
            className={styles.viewer}
            style={{ backgroundImage: selectedImage ? `url('${selectedImage}')` : 'none' }}
          >
            <div className={styles.overlay}>
              <div className={styles.header}>
                <div className={styles.imageCount}>
                  <div className={styles.imageCountIcon} />
                  <div>
                    {`${selectedImageIndex + 1} `}
                    <FormattedMessage id="lightbox.of">
                      {(message: string) => <span>{message}</span>}
                    </FormattedMessage>
                    {` ${imagesLength} `}
                    <FormattedMessage id={pluralImageText ? 'lightbox.images' : 'lightbox.image'}>
                      {(message: string) => <span>{message}</span>}
                    </FormattedMessage>
                  </div>
                </div>
                <div className={styles.close} onClick={onDismiss} />
              </div>
              <div className={styles.controls}>
                <div className={backArrowStyles} onClick={this.onBackClick} />
                <div className={nextArrowStyles} onClick={this.onNextClick} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
