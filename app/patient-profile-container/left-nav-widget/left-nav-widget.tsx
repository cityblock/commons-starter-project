import * as React from 'react';
import LeftNavActions from './left-nav-actions';

export type Selected = 'careTeam' | 'scratchPad' | 'message' | 'quickActions';

interface IProps {
  patientId: string;
}

interface IState {
  selected: Selected | null;
}

// TODO: Deprecate Care Team Widget component and styles after finishing this
class LeftNavWidget extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { selected: null };
  }

  handleClick = (selected: Selected): void => {
    this.setState({ selected });
  };

  render(): JSX.Element {
    return (
      <div>
        <LeftNavActions onClick={this.handleClick} />
      </div>
    );
  }
}

export default LeftNavWidget;
