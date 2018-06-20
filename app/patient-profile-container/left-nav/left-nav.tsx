import React from 'react';
import { FullPatientForProfile } from '../../graphql/types';
import styles from './css/left-nav.css';
import LeftNavHeader from './header';
import Contact from './info-group/contact';
import Demographics from './info-group/demographics';
import Medications from './info-group/medications';
import Plan from './info-group/plan';
import ProblemList from './info-group/problem-list';

export type Accordion = 'demographics' | 'contact' | 'plan' | 'medications' | 'problemList';

interface IProps {
  patient: FullPatientForProfile | null;
}

interface IState {
  selected: Accordion | null;
}

class LeftNav extends React.Component<IProps, IState> {
  state = { selected: null };

  handleClick = (clicked: Accordion): void => {
    const { selected } = this.state;

    if (clicked === selected) {
      this.setState({ selected: null });
    } else {
      this.setState({ selected: clicked });
    }
  };

  render(): JSX.Element {
    const { patient } = this.props;
    const { selected } = this.state;

    return (
      <div className={styles.container}>
        <LeftNavHeader patient={patient} />
        {!!patient && (
          <div>
            <Demographics
              patient={patient}
              isOpen={selected === 'demographics'}
              onClick={this.handleClick}
            />
            <Contact patient={patient} isOpen={selected === 'contact'} onClick={this.handleClick} />
            <Plan patient={patient} isOpen={selected === 'plan'} onClick={this.handleClick} />
            <Medications
              patientId={patient.id}
              isOpen={selected === 'medications'}
              onClick={this.handleClick}
            />
            <ProblemList
              patientId={patient.id}
              isOpen={selected === 'problemList'}
              onClick={this.handleClick}
            />
          </div>
        )}
      </div>
    );
  }
}

export default LeftNav;
