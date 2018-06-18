import React from 'react';
import { connect, Dispatch } from 'react-redux';
import { closePopup, openPopup } from '../../../actions/popup-action';
import { IState as IAppState } from '../../../store';
import HamburgerMenuOption from '../../library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../library/hamburger-menu/hamburger-menu';

interface IStateProps {
  open: boolean;
}

interface IDispatchProps {
  addGoal: () => void;
  closeMenu: () => void;
  openMenu: () => void;
  deleteConcern: () => void;
}

interface IProps {
  patientId: string;
  patientConcernId: string;
  patientConcernTitle: string;
  goalSuggestionTemplateIds: string[];
  taskOpen: boolean;
  canDelete: boolean;
}

type allProps = IProps & IStateProps & IDispatchProps;

export class PatientConcernOptions extends React.Component<allProps, {}> {
  onMenuToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    const { open, taskOpen, closeMenu, openMenu } = this.props;

    // do not allow opening menu if task is open, just makes it less messy
    if (!taskOpen) {
      open ? closeMenu() : openMenu();
    }
  };

  render() {
    const { open, addGoal, deleteConcern, taskOpen, canDelete } = this.props;

    return (
      <HamburgerMenu open={open && !taskOpen} onMenuToggle={this.onMenuToggle}>
        <HamburgerMenuOption
          messageId="patientMap.addGoal"
          icon="addCircleOutline"
          onClick={addGoal}
        />
        {canDelete && (
          <HamburgerMenuOption
            messageId="concernDelete.menu"
            icon="delete"
            onClick={deleteConcern}
          />
        )}
      </HamburgerMenu>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps: IProps): IStateProps => {
  const open =
    state.popup.name === 'PATIENT_CONCERN_OPTIONS' &&
    state.popup.options.patientConcernId === ownProps.patientConcernId;

  return { open };
};

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: IProps): IDispatchProps => {
  const { patientId, patientConcernId, patientConcernTitle, goalSuggestionTemplateIds } = ownProps;
  const addGoal = () =>
    dispatch(
      openPopup({
        name: 'CREATE_PATIENT_GOAL',
        options: {
          patientId,
          patientConcernId,
          goalSuggestionTemplateIds,
        },
      }),
    );
  const deleteConcern = () =>
    dispatch(
      openPopup({
        name: 'DELETE_PATIENT_CONCERN',
        options: {
          patientConcernId,
          patientConcernTitle,
        },
      }),
    );
  const openMenu = () =>
    dispatch(
      openPopup({
        name: 'PATIENT_CONCERN_OPTIONS',
        options: {
          patientConcernId,
        },
      }),
    );

  return {
    addGoal,
    closeMenu: () => dispatch(closePopup()),
    openMenu,
    deleteConcern,
  };
};

export default connect<IStateProps, IDispatchProps, IProps>(
  mapStateToProps as (args?: any) => IStateProps,
  mapDispatchToProps as any,
)(PatientConcernOptions);
