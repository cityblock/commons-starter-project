import * as React from 'react';
import { FullPatientForProfileFragment } from '../../graphql/types';
import LeftNavHeader from './header';

type Selected = 'demographic' | 'contact' | 'plan' | 'medications' | 'problemList';

interface IProps {
  patient: FullPatientForProfileFragment | null;
}

interface IState {
  selected: Selected | null;
}

class LeftNav extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { selected: null };
  }

  handleClick = (clicked: Selected): void => {
    const { selected } = this.state;

    if (clicked === selected) {
      this.setState({ selected: null });
    } else {
      this.setState({ selected: clicked });
    }
  };

  render(): JSX.Element {
    const { patient } = this.props;

    return (
      <div>
        <LeftNavHeader patient={patient} />
      </div>
    );
  }
}

export default LeftNav;
