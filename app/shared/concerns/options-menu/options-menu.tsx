import * as React from 'react';
import HamburgerMenuOption from '../../library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../library/hamburger-menu/hamburger-menu';

interface IProps {
  open: boolean;
  onMenuToggle: (e?: any) => void;
}

const PatientConcernOptions: React.StatelessComponent<IProps> = ({ open, onMenuToggle }) =>
  (
    <HamburgerMenu open={open} onMenuToggle={onMenuToggle}>
      <HamburgerMenuOption
        messageId='patientMap.addGoal'
        icon='addCircleOutline'
        onClick={() => true} />
    </HamburgerMenu>
  );

PatientConcernOptions.displayName = 'PatientConcernOptions';

export default PatientConcernOptions;
