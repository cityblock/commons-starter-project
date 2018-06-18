import classNames from 'classnames';
import React from 'react';
import { Gender } from '../../../graphql/types';
import styles from './css/patient-photo-image.css';
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
        [styles.squareLarge]: type === 'squareLarge',
        [styles.square]: type === 'square',
        [styles.circle]: type === 'circle',
        [styles.circleLarge]: type === 'circleLarge',
      },
      className,
    );

    return <img src={imgUrl} className={imgStyles} />;
  }

  const isFemale = gender === 'female';
  const isMale = gender === 'male';

  const missingStyles = classNames(
    {
      [styles.squareLarge]: type === 'squareLarge',
      [styles.square]: type === 'square',
      [styles.circleSvg]: type === 'circle',
      [styles.circleSvgLarge]: type === 'circleLarge',
      [styles.male]: isMale,
      [styles.female]: isFemale,
      [styles.unspecified]: !isFemale && !isMale,
    },
    className,
  );

  return <div className={missingStyles} />;
};

export default PatientPhotoImage;
