import { Fragment } from 'react';
import React from 'react';
import { FullPatientContactFragment } from '../../../graphql/types';
import {
  formatAddressFirstLine,
  formatAddressSecondLine,
  formatFullName,
} from '../../../shared/helpers/format-helpers';
import HamburgerMenuOption from '../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../shared/library/hamburger-menu/hamburger-menu';
import Text, { Color } from '../../../shared/library/text/text';
import styles from '../css/team-member.css';

interface IProps {
  patientContact: FullPatientContactFragment;
  onRemoveClick: (patientContactId: string) => void;
  onEditClick: (patientContactToEdit: FullPatientContactFragment) => void;
}

interface IState {
  isMenuOpen: boolean;
}

export class PatientFamilyMember extends React.Component<IProps, IState> {
  state = { isMenuOpen: false };

  onMenuToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    const { isMenuOpen } = this.state;

    this.setState({ isMenuOpen: !isMenuOpen });
  };

  handleEdit = () => {
    const { patientContact, onEditClick } = this.props;
    onEditClick(patientContact);
  };

  handleRemove = () => {
    const { patientContact, onRemoveClick } = this.props;
    onRemoveClick(patientContact.id);
  };

  render() {
    const {
      isEmergencyContact,
      isHealthcareProxy,
      firstName,
      lastName,
      relationToPatient,
      relationFreeText,
      phone,
      email,
      address,
      description,
    } = this.props.patientContact;
    const { isMenuOpen } = this.state;
    const emailAddress = email ? email.emailAddress : 'Unknown Email';
    const phoneNumber = phone ? phone.phoneNumber : 'Unknown Phone';

    let roleMessageId;
    let color: Color | null = null;
    if (isEmergencyContact) {
      roleMessageId = 'patientContact.emergencyContact';
      color = 'red';
    } else if (isHealthcareProxy) {
      roleMessageId = 'patientContact.healthcareProxy';
      color = 'purple';
    }

    const contactRoleHtml =
      roleMessageId && color ? (
        <Fragment>
          <span className={styles.bullet}>&bull;</span>
          <Text messageId={roleMessageId} color={color} size="medium" />
        </Fragment>
      ) : null;

    const addressFirstLine = address ? formatAddressFirstLine(address) : null;
    const addressSecondLine = address ? formatAddressSecondLine(address) : null;

    const addressHtml =
      addressFirstLine || addressSecondLine ? (
        <div className={styles.column}>
          <Text text={addressFirstLine || 'Unknown Street'} color="black" size="medium" />
          <Text text={addressSecondLine || ''} color="black" size="medium" />
        </div>
      ) : (
        <div className={styles.column}>
          <Text text={'Unknown Address'} color="black" size="medium" />
        </div>
      );

    const noteHtml = description ? (
      <div className={styles.footer}>
        <Text color="gray" text={description} size="medium" />
      </div>
    ) : null;

    const relationHtml =
      relationToPatient === 'other' ? (
        <Text text={relationFreeText || ''} color="gray" size="medium" />
      ) : (
        <Text messageId={`relationToPatient.${relationToPatient}`} color="gray" size="medium" />
      );

    return (
      <Fragment>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <Text
                text={formatFullName(firstName, lastName)}
                color="black"
                size="largest"
                isBold={true}
              />
              <div className={styles.row}>
                {relationHtml}
                {contactRoleHtml}
              </div>
            </div>

            <div className={styles.column}>
              <Text text={phoneNumber} color="black" size="medium" />
              <Text text={emailAddress} color="black" size="medium" />
            </div>

            {addressHtml}
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
      </Fragment>
    );
  }
}

export default PatientFamilyMember;
