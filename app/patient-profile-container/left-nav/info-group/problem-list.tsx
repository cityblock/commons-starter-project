import * as React from 'react';
import { Selected } from '../left-nav';
import InfoGroupContainer from './container';
import * as styles from './css/shared.css';
import InfoGroupHeader from './header';
import InfoGroupItem from './item';

interface IProps {
  isOpen: boolean;
  onClick: (clicked: Selected) => void;
}

// TODO: Remove hard coded values
const ProblemList: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOpen, onClick } = props;

  return (
    <div className={styles.container}>
      <InfoGroupHeader selected="problemList" isOpen={isOpen} onClick={onClick} itemCount={5} />
      <InfoGroupContainer isOpen={isOpen}>
        <InfoGroupItem label="Diabetes Type 2" value="E11.9" />
        <InfoGroupItem label="Congestive Heart Failure" value="428.4" />
        <InfoGroupItem label="Arthritis" value="M19.90" />
        <InfoGroupItem label="Depression" value="F33.0" />
        <InfoGroupItem label="Sleep Apnea" value="327.23" />
      </InfoGroupContainer>
    </div>
  );
};

export default ProblemList;
