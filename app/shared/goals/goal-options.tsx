import * as React from 'react';
import HamburgerMenuOption from '../library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../library/hamburger-menu/hamburger-menu';

interface IProps {
  open: boolean;
  onMenuToggle: (e?: any) => void;
  addTask: () => void;
}

const GoalOptions: React.StatelessComponent<IProps> = ({ open, onMenuToggle, addTask }) => (
  <HamburgerMenu open={open} onMenuToggle={onMenuToggle}>
    <HamburgerMenuOption messageId="patientMap.addTask" icon="addAlert" onClick={addTask} />
  </HamburgerMenu>
);

GoalOptions.displayName = 'GoalOptions';

export default GoalOptions;
