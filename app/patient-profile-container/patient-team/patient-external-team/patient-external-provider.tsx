import React from 'react';
import { FullPatientExternalProvider } from '../../../graphql/types';
import { formatFullName } from '../../../shared/helpers/format-helpers';
import HamburgerMenuOption from '../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../shared/library/hamburger-menu/hamburger-menu';
import Text from '../../../shared/library/text/text';
import styles from '../css/team-member.css';

interface IProps {
  patientExternalProvider: FullPatientExternalProvider;
  onRemoveClick: (patientExternalProviderId: string) => void;
  onEditClick: (patientExternalProviderToEdit: FullPatientExternalProvider) => void;
}

interface IState {
  isMenuOpen: boolean;
}

export class PatientExternalProvider extends React.Component<IProps, IState> {
  state = { isMenuOpen: false };

  onMenuToggle = () => {
    const { isMenuOpen } = this.state;

    this.setState({ isMenuOpen: !isMenuOpen });
  };

  handleEdit = () => {
    const { patientExternalProvider, onEditClick } = this.props;
    onEditClick(patientExternalProvider);
  };

  handleRemove = () => {
    const { patientExternalProvider, onRemoveClick } = this.props;
    onRemoveClick(patientExternalProvider.id);
  };

  render() {
    const {
      firstName,
      lastName,
      role,
      roleFreeText,
      phone,
      email,
      description,
      patientExternalOrganization,
    } = this.props.patientExternalProvider;
    const { isMenuOpen } = this.state;
    const emailAddress = email ? email.emailAddress : 'Unknown Email';
    const phoneNumber = phone ? phone.phoneNumber : 'Unknown Phone';

    const noteHtml = description ? (
      <div className={styles.footer}>
        <Text color="gray" text={description} size="medium" />
      </div>
    ) : null;

    const nameText =
      firstName || lastName
        ? formatFullName(firstName, lastName)
        : patientExternalOrganization.name;
    const agencyText = firstName || lastName ? patientExternalOrganization.name : null;

    const roleHtml =
      role === 'other' || role === 'otherMedicalSpecialist' ? (
        <Text text={roleFreeText || ''} color="gray" size="medium" />
      ) : (
        <Text messageId={`externalProviderRole.${role}`} color="gray" size="medium" />
      );

    return (
      <div className={styles.container}>
        <div className={styles.body}>
          <div className={styles.row}>
            <div className={styles.column}>
              <Text text={nameText} color="black" size="largest" isBold={true} />
              {roleHtml}
            </div>

            <div className={styles.column}>
              <Text text={phoneNumber} color="black" size="medium" />
              <Text text={emailAddress} color="black" size="medium" />
            </div>

            <Text text={agencyText || ''} color="black" size="medium" className={styles.column} />
          </div>
          <HamburgerMenu open={isMenuOpen} onMenuToggle={this.onMenuToggle}>
            <HamburgerMenuOption
              messageId="patientTeam.edit"
              icon="create"
              onClick={this.handleEdit}
            />
            <HamburgerMenuOption
              messageId="patientTeam.remove"
              icon="removeCircle"
              onClick={this.handleRemove}
            />
          </HamburgerMenu>
        </div>
        {noteHtml}
      </div>
    );
  }
}

export default PatientExternalProvider;
