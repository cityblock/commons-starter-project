import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { updatePatientLeftNavSelected } from '../../actions/patient-left-nav-action';
import { IState as Selected } from '../../reducers/patient-left-nav-reducer';
import { IState as IAppState } from '../../store';
import LeftNavActions from './left-nav-actions';
import LeftNavOpen from './left-nav-open';

interface IProps {
  patientId: string;
  glassBreakId: string | null;
}

interface IStateProps {
  selected: Selected;
}

interface IDispatchProps {
  updateSelected: (selected: Selected) => void;
}

type allProps = IProps & IStateProps & IDispatchProps;

interface IState {
  isOpen: boolean;
}

const ANIMATION_TIME = 300;

export class LeftNavWidget extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    // open left nav if something selected
    this.state = { isOpen: !!props.selected };
  }

  handleClick = (selected: Selected): void => {
    this.props.updateSelected(selected);
    this.setState({ isOpen: true });
  };

  componentWillUnmount(): void {
    // if unmounting, deselect open left nav
    this.props.updateSelected(null);
  }

  handleClose = (): void => {
    this.setState({ isOpen: false });

    // don't update state until transition complete
    setTimeout(() => this.props.updateSelected(null), ANIMATION_TIME);
  };

  render(): JSX.Element {
    const { patientId, glassBreakId, selected } = this.props;
    const { isOpen } = this.state;

    return (
      <div>
        <LeftNavOpen
          patientId={patientId}
          isOpen={isOpen}
          selected={selected}
          onClose={this.handleClose}
          glassBreakId={glassBreakId}
        />
        <LeftNavActions onClick={this.handleClick} />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  return {
    selected: state.patientLeftNav,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): IDispatchProps => {
  return {
    updateSelected: (selected: Selected) => dispatch(updatePatientLeftNavSelected(selected)),
  };
};

export default connect<IStateProps, IDispatchProps, IProps>(
  mapStateToProps as (args?: any) => IStateProps,
  mapDispatchToProps as any,
)(LeftNavWidget);
