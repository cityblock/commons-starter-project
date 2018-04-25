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
  deleteGoal: () => void;
}

interface IProps {
  patientGoalId: string;
  patientGoalTitle: string;
  addTask: () => void;
  taskOpen: boolean;
  canDelete: boolean;
}

type allProps = IStateProps & IDispatchProps & IProps;

export const GoalOptions: React.StatelessComponent<allProps> = (props: allProps) => {
  const { open, addTask, deleteGoal, closeMenu, openMenu, taskOpen, canDelete } = props;

  const onClick = () => {
    closeMenu();
    addTask();
  };

  return (
    <HamburgerMenu open={open && !taskOpen} onMenuToggle={open ? closeMenu : openMenu}>
      <HamburgerMenuOption messageId="patientMap.addTask" icon="addAlert" onClick={onClick} />
      {canDelete && (
        <HamburgerMenuOption messageId="goalDelete.menu" icon="delete" onClick={deleteGoal} />
      )}
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

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: IProps): IDispatchProps => {
  const { patientGoalId, patientGoalTitle } = ownProps;

  const openMenu = () =>
    dispatch(
      openPopup({
        name: 'PATIENT_GOAL_OPTIONS',
        options: {
          patientGoalId,
        },
      }),
    );
  const deleteGoal = () =>
    dispatch(
      openPopup({
        name: 'DELETE_PATIENT_GOAL',
        options: {
          patientGoalTitle,
          patientGoalId,
        },
      }),
    );

  return {
    closeMenu: () => dispatch(closePopup()),
    openMenu,
    deleteGoal,
  };
};

export default connect<IStateProps, IDispatchProps, IProps>(
  mapStateToProps as (args?: any) => IStateProps,
  mapDispatchToProps as any,
)(GoalOptions);
