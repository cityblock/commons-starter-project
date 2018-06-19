import classNames from 'classnames';
import React from 'react';
import HamburgerMenuOption from '../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../shared/library/hamburger-menu/hamburger-menu';
import Text, { Color, Size } from '../../shared/library/text/text';
import styles from './css/team-member.css';

interface IMember {
  id: string;
  isConsentedForFamilyPlanning?: boolean | null;
  isConsentedForHiv?: boolean | null;
  isConsentedForGeneticTesting?: boolean | null;
  isConsentedForStd?: boolean | null;
  isConsentedForSubstanceUse?: boolean | null;
  isConsentedForMentalHealth?: boolean | null;
  description?: string | null;
}

interface IProps<T extends IMember> {
  member: T;
  children: any;
  onRemoveClick: (patientExternalOrganizationId: string) => void;
  onEditClick: (memberToEdit: T) => void;
}

interface IState {
  isMenuOpen: boolean;
}

export class ConsentDisplayCard<T extends IMember> extends React.Component<IProps<T>, IState> {
  state = { isMenuOpen: false };

  onMenuToggle = () => {
    const { isMenuOpen } = this.state;

    this.setState({ isMenuOpen: !isMenuOpen });
  };

  handleEdit = () => {
    const { member, onEditClick } = this.props;
    onEditClick(member);
  };

  handleRemove = () => {
    const { member, onRemoveClick } = this.props;
    onRemoveClick(member.id);
  };

  handleConsents = () => {
    // TODO
  };

  getConsentLevel = () => {
    const {
      isConsentedForFamilyPlanning,
      isConsentedForHiv,
      isConsentedForGeneticTesting,
      isConsentedForStd,
      isConsentedForSubstanceUse,
      isConsentedForMentalHealth,
    } = this.props.member;

    const level =
      isConsentedForFamilyPlanning &&
      isConsentedForHiv &&
      isConsentedForGeneticTesting &&
      isConsentedForStd &&
      isConsentedForSubstanceUse &&
      isConsentedForMentalHealth;
    if (level === true) {
      return 'fullConsent';
    } else if (level === false) {
      return 'partialConsent';
    }
    return 'noConsent';
  };

  getConsentOptions = () => {
    const {
      isConsentedForFamilyPlanning,
      isConsentedForHiv,
      isConsentedForGeneticTesting,
      isConsentedForStd,
      isConsentedForSubstanceUse,
      isConsentedForMentalHealth,
    } = this.props.member;
    const stylingProps = { color: 'gray' as Color, size: 'medium' as Size, isBold: true };

    const family = !isConsentedForFamilyPlanning ? (
      <Text messageId="sharingConsent.isConsentedForFamilyPlanning" {...stylingProps} />
    ) : null;
    const hiv = !isConsentedForHiv ? (
      <Text messageId="sharingConsent.isConsentedForHiv" {...stylingProps} />
    ) : null;
    const std = !isConsentedForStd ? (
      <Text messageId="sharingConsent.isConsentedForStd" {...stylingProps} />
    ) : null;
    const genetic = !isConsentedForGeneticTesting ? (
      <Text messageId="sharingConsent.isConsentedForGeneticTesting" {...stylingProps} />
    ) : null;
    const substance = !isConsentedForSubstanceUse ? (
      <Text messageId="sharingConsent.isConsentedForSubstanceUse" {...stylingProps} />
    ) : null;
    const mental = !isConsentedForMentalHealth ? (
      <Text messageId="sharingConsent.isConsentedForMentalHealth" {...stylingProps} />
    ) : null;

    return (
      <div className={styles.commaSeparated}>
        {family}
        {hiv}
        {std}
        {substance}
        {genetic}
        {mental}
      </div>
    );
  };

  render() {
    const { children, member } = this.props;
    const { description } = member;
    const { isMenuOpen } = this.state;

    const noteHtml = description ? (
      <Text color="gray" text={description} size="medium" className={styles.spacing} />
    ) : null;

    const level = this.getConsentLevel();
    const consentStyle = classNames(styles.body, styles[level]);
    let consentHtml = (
      <Text messageId={`sharingConsent.${level}`} color="gray" size="medium" isBold={true} />
    );
    if (level === 'partialConsent') {
      consentHtml = (
        <div>
          {consentHtml}
          {this.getConsentOptions()}
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <div className={consentStyle}>
          {children}
          <HamburgerMenu open={isMenuOpen} onMenuToggle={this.onMenuToggle}>
            <HamburgerMenuOption
              messageId="patientTeam.updateConsent"
              icon="security"
              onClick={this.handleConsents}
            />
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
        <div className={styles.footer}>
          {consentHtml}
          {noteHtml}
        </div>
      </div>
    );
  }
}

export default ConsentDisplayCard;