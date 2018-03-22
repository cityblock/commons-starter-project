import * as classNames from 'classnames';
import * as React from 'react';
import { Gender } from '../../../graphql/types';
import * as styles from './css/patient-photo-image.css';
import { PhotoType } from './patient-photo';

interface IProps {
  imgUrl: string | null;
  gender: Gender | null;
  className?: string | null;
  type: PhotoType;
}

const PatientPhotoImage: React.StatelessComponent<IProps> = (props: IProps) => {
  const { imgUrl, gender, className, type } = props;

  if (imgUrl) {
    const imgStyles = classNames(
      {
        [styles.large]: type === 'large',
        [styles.circle]: type === 'circle',
      },
      className,
    );

    return <img src={imgUrl} className={imgStyles} />;
  }

  const isFemale = gender === 'female';
  const isMale = gender === 'male';

  const missingStyles = classNames(
    {
      [styles.large]: type === 'large',
      [styles.circleSvg]: type === 'circle',
      [styles.male]: isMale,
      [styles.female]: isFemale,
      [styles.unspecified]: !isFemale && !isMale,
    },
    className,
  );

  return <div className={missingStyles} />;
};

export default PatientPhotoImage;
