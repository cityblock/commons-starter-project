import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { closePopup, openPopup } from '../../actions/popup-action';
import { IState as IAppState } from '../../store';
import HamburgerMenuOption from '../library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../library/hamburger-menu/hamburger-menu';

interface IStateProps {
  open: boolean;
}

interface IDispatchProps {
  closeMenu: () => void;
  openMenu: () => void;
}

interface IProps {
  patientGoalId: string;
  addTask: () => void;
  taskOpen: boolean;
}

type allProps = IStateProps & IDispatchProps & IProps;

export const GoalOptions: React.StatelessComponent<allProps> = (props: allProps) => {
  const { open, addTask, closeMenu, openMenu, taskOpen } = props;

  const onClick = () => {
    closeMenu();
    addTask();
  };

  return (
    <HamburgerMenu open={open && !taskOpen} onMenuToggle={open ? closeMenu : openMenu}>
      <HamburgerMenuOption messageId="patientMap.addTask" icon="addAlert" onClick={onClick} />
    </HamburgerMenu>
  );
};

GoalOptions.displayName = 'GoalOptions';

const mapStateToProps = (state: IAppState, ownProps: IProps): IStateProps => {
  const open =
    state.popup.name === 'PATIENT_GOAL_OPTIONS' &&
    state.popup.options.patientGoalId === ownProps.patientGoalId;

  return { open };
};

const mapDispatchToProps = (dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps => {
  const { patientGoalId } = ownProps;

  const openMenu = () =>
    dispatch(
      openPopup({
        name: 'PATIENT_GOAL_OPTIONS',
        options: {
          patientGoalId,
        },
      }),
    );

  return {
    closeMenu: () => dispatch(closePopup()),
    openMenu,
  };
};

export default connect<IStateProps, IDispatchProps, IProps>(
  mapStateToProps as (args?: any) => IStateProps,
  mapDispatchToProps,
)(GoalOptions);
