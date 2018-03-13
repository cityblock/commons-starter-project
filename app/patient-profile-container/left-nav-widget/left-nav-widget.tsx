import * as React from 'react';
import LeftNavActions from './left-nav-actions';
import LeftNavOpen from './left-nav-open';

export type Selected = 'careTeam' | 'scratchPad' | 'message' | 'quickActions';

interface IProps {
  patientId: string;
  glassBreakId: string | null;
}

interface IState {
  selected: Selected | null;
  isOpen: boolean;
}

class LeftNavWidget extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { selected: null, isOpen: false };
  }

  handleClick = (selected: Selected): void => {
    this.setState({ selected, isOpen: true });
  };

  render(): JSX.Element {
    const { patientId, glassBreakId } = this.props;
    const { selected, isOpen } = this.state;

    return (
      <div>
        <LeftNavOpen
          patientId={patientId}
          isOpen={isOpen}
          selected={selected}
          onClose={() => this.setState({ isOpen: false })}
          glassBreakId={glassBreakId}
        />
        <LeftNavActions onClick={this.handleClick} />
      </div>
    );
  }
}

export default LeftNavWidget;
