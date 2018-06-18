import React from 'react';
import { connect, Dispatch } from 'react-redux';
import { closePopup, openPopup } from '../../actions/popup-action';
import HamburgerMenuOption from '../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../shared/library/hamburger-menu/hamburger-menu';
import { IState as IAppState } from '../../store';

interface IStateProps {
  open: boolean;
}

interface IDispatchProps {
  closeMenu: () => void;
  openMenu: () => void;
  flagComputedField: () => void;
}

interface IProps {
  patientAnswerIds: string[];
  questionId: string;
}

type allProps = IStateProps & IDispatchProps & IProps;

export class PatientQuestionMenu extends React.Component<allProps, {}> {
  onMenuToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    const { open, closeMenu, openMenu } = this.props;
    open ? closeMenu() : openMenu();
  };

  render(): JSX.Element {
    const { open, flagComputedField } = this.props;

    return (
      <HamburgerMenu open={open} onMenuToggle={this.onMenuToggle}>
        <HamburgerMenuOption
          messageId="computedField.flag"
          icon="warning"
          onClick={flagComputedField}
        />
      </HamburgerMenu>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps: IProps): IStateProps => {
  const open =
    state.popup.name === 'PATIENT_QUESTION_OPTIONS' &&
    state.popup.options.questionId === ownProps.questionId;

  return { open };
};

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: IProps): IDispatchProps => {
  const { questionId, patientAnswerIds } = ownProps;
  const openMenu = () => {
    dispatch(
      openPopup({
        name: 'PATIENT_QUESTION_OPTIONS',
        options: {
          patientAnswerIds,
          questionId,
        },
      }),
    );
  };
  const closeMenu = () => dispatch(closePopup());
  const flagComputedField = () => {
    dispatch(
      openPopup({
        name: 'COMPUTED_FIELD_FLAG',
        options: {
          patientAnswerIds,
        },
      }),
    );
  };

  return { openMenu, closeMenu, flagComputedField };
};

export default connect<IStateProps, IDispatchProps, IProps>(
  mapStateToProps as (args?: any) => IStateProps,
  mapDispatchToProps as any,
)(PatientQuestionMenu);
