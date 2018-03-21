import * as classNames from 'classnames';
import * as React from 'react';
import { Gender } from '../../../graphql/types';
import * as styles from './css/patient-photo-large.css';

interface IProps {
  imgUrl: string | null;
  gender: Gender | null;
  className?: string | null;
}

const PatientPhotoLarge: React.StatelessComponent<IProps> = (props: IProps) => {
  const { imgUrl, gender, className } = props;

  if (imgUrl) {
    const imgStyles = classNames(styles.img, className);
    return <img src={imgUrl} className={imgStyles} />;
  }

  const isFemale = gender === 'female';
  const isMale = gender === 'male';

  const missingStyles = classNames(
    styles.img,
    {
      [styles.male]: isMale,
      [styles.female]: isFemale,
      [styles.unspecified]: !isFemale && !isMale,
    },
    className,
  );

  return <div className={missingStyles} />;
};

export default PatientPhotoLarge;
