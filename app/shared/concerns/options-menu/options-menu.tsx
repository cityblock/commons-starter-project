import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { openPopup } from '../../../actions/popup-action';
import HamburgerMenuOption from '../../library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../library/hamburger-menu/hamburger-menu';

interface IProps {
  open: boolean;
  onMenuToggle: (e?: any) => void;
  patientId: string;
  patientConcernId: string;
  goalSuggestionTemplateIds: string[];
}

interface IDispatchProps {
  addGoal: () => void;
}

type allProps = IProps & IDispatchProps;

export const PatientConcernOptions: React.StatelessComponent<allProps> = (props: allProps) => {
  const { open, onMenuToggle, addGoal } = props;

  return (
    <HamburgerMenu open={open} onMenuToggle={onMenuToggle}>
      <HamburgerMenuOption
        messageId="patientMap.addGoal"
        icon="addCircleOutline"
        onClick={addGoal}
      />
    </HamburgerMenu>
  );
};

PatientConcernOptions.displayName = 'PatientConcernOptions';

const mapDispatchToProps = (dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps => {
  const { patientId, patientConcernId, goalSuggestionTemplateIds } = ownProps;
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

  return { addGoal };
};

export default connect<{}, IDispatchProps, IProps>(null, mapDispatchToProps)(PatientConcernOptions);
