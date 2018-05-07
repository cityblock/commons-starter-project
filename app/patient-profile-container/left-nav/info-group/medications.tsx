import * as React from 'react';
import { Accordion } from '../left-nav';
import InfoGroupContainer from './container';
import * as styles from './css/shared.css';
import InfoGroupHeader from './header';
import InfoGroupItem from './item';

interface IProps {
  isOpen: boolean;
  onClick: (clicked: Accordion) => void;
}

// TODO: Remove hard coded values
const Medications: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOpen, onClick } = props;

  return (
    <div className={styles.container}>
      <InfoGroupHeader selected="medications" isOpen={isOpen} onClick={onClick} itemCount={4} />
      <InfoGroupContainer isOpen={isOpen}>
        <InfoGroupItem label="Aspirin" value="81 mg" />
        <InfoGroupItem label="Acarbose (Precose)" value="11 mg" />
        <InfoGroupItem label="Accolate (Zafirlukast)" value="21 mg" />
        <InfoGroupItem label="Accretropin (Somatropin Injection)" value="2 mL" />
      </InfoGroupContainer>
    </div>
  );
};

export default Medications;
