import { Fragment } from 'react';
import * as React from 'react';
import { FullPatientExternalProviderFragment } from '../../../graphql/types';
import { formatFullName } from '../../../shared/helpers/format-helpers';
import HamburgerMenuOption from '../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../shared/library/hamburger-menu/hamburger-menu';
import SmallText from '../../../shared/library/small-text/small-text';
import * as styles from '../css/team-member.css';

interface IProps {
  patientExternalProvider: FullPatientExternalProviderFragment;
  onRemoveClick: (patientExternalProviderId: string) => void;
  onEditClick: (patientExternalProviderToEdit: FullPatientExternalProviderFragment) => void;
}

interface IState {
  isMenuOpen: boolean;
}

export class PatientExternalProvider extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { isMenuOpen: false };
  }

  onMenuToggle = (e: React.MouseEvent<HTMLDivElement>) => {
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
      agencyName,
      role,
      roleFreeText,
      phone,
      email,
      description,
    } = this.props.patientExternalProvider;
    const { isMenuOpen } = this.state;
    const emailAddress = email ? email.emailAddress : 'Unknown Email';
    const phoneNumber = phone ? phone.phoneNumber : 'Unknown Phone';

    const noteHtml = description ? (
      <div className={styles.footer}>
        <SmallText color="gray" text={description} size="medium" />
      </div>
    ) : null;

    const nameText = firstName || lastName ? formatFullName(firstName, lastName) : agencyName;
    const agencyText = firstName || lastName ? agencyName : null;

    const roleHtml =
      role === 'other' || role === 'otherMedicalSpecialist' ? (
        <SmallText text={roleFreeText || ''} color="gray" size="medium" />
      ) : (
        <SmallText messageId={`externalProviderRole.${role}`} color="gray" size="medium" />
      );

    return (
      <Fragment>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <SmallText text={nameText} color="black" size="largest" isBold={true} />
              {roleHtml}
            </div>

            <div className={styles.column}>
              <SmallText text={phoneNumber} color="black" size="medium" />
              <SmallText text={emailAddress} color="black" size="medium" />
            </div>

            <SmallText
              text={agencyText || ''}
              color="black"
              size="medium"
              className={styles.column}
            />
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

export default PatientExternalProvider;