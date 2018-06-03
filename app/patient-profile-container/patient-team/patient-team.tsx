import * as React from 'react';
import Button from '../../shared/library/button/button';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import CreatePatientContactModal from '../../shared/patient-contact-modal/create-patient-contact-modal';
import * as styles from './css/patient-team.css';
import AddCareTeamMemberModal from './patient-cityblock-care-team/add-care-team-member-modal';
import PatientCityblockCareTeam from './patient-cityblock-care-team/patient-cityblock-care-team';
import CreatePatientExternalProviderModal from './patient-external-team/create-patient-external-provider-modal';
import PatientExternalTeam from './patient-external-team/patient-external-team';
import PatientFamilyTeam from './patient-family-team/patient-family-team';

export type SelectableTabs = 'cityblock' | 'external' | 'family-and-support';

interface IProps {
  match: {
    params: {
      patientId: string;
      subTab?: SelectableTabs;
    };
  };
}

interface ICurrentSubTab {
  isCityblockCareTeam: boolean;
  isExternalCareTeam: boolean;
  isFamilyAndSupportTeam: boolean;
}

export type AddCareTeamMemberModalFilters = 'primaryCarePhysician' | 'communityHealthPartner';

interface IState {
  isModalVisible: boolean;
  isAddingEmergencyContact?: boolean;
  addCareTeamMemberModalFilter?: AddCareTeamMemberModalFilters | null;
}

export class PatientTeam extends React.Component<IProps, IState> {
  state = {
    isModalVisible: false,
    isAddingEmergencyContact: undefined,
    addCareTeamMemberModalFilter: undefined,
  };

  getCurrentSubTab(): ICurrentSubTab {
    const { match } = this.props;
    const subTab = match.params.subTab;

    const isCityblockCareTeam = !subTab || subTab === 'cityblock';
    const isExternalCareTeam = subTab === 'external';
    const isFamilyAndSupportTeam = subTab === 'family-and-support';

    return {
      isCityblockCareTeam,
      isExternalCareTeam,
      isFamilyAndSupportTeam,
    };
  }

  onClickAddButton = () => {
    this.setState({ isModalVisible: true });
  };

  onClickAddRequiredCareTeamMember = (filter: AddCareTeamMemberModalFilters) => {
    this.setState({ isModalVisible: true, addCareTeamMemberModalFilter: filter });
  };

  onClosePopup = () => {
    this.setState({
      isModalVisible: false,
      isAddingEmergencyContact: false,
      addCareTeamMemberModalFilter: null,
    });
  };

  handleAddEmergencyContact = () => {
    this.setState({ isModalVisible: true, isAddingEmergencyContact: true });
  };

  renderAddButton() {
    const currentSubTab = this.getCurrentSubTab();
    let messageId = 'patientTeam.addCityblockCareTeamButton';

    if (currentSubTab.isExternalCareTeam) {
      messageId = 'patientTeam.addExternalCareTeamButton';
    } else if (currentSubTab.isFamilyAndSupportTeam) {
      messageId = 'patientTeam.addFamilyAndSupportTeamButton';
    }

    return <Button messageId={messageId} onClick={this.onClickAddButton} />;
  }

  renderAddModal() {
    const { isModalVisible, isAddingEmergencyContact, addCareTeamMemberModalFilter } = this.state;
    const { match } = this.props;
    const {
      isCityblockCareTeam,
      isExternalCareTeam,
      isFamilyAndSupportTeam,
    } = this.getCurrentSubTab();

    if (isCityblockCareTeam) {
      return (
        <AddCareTeamMemberModal
          isVisible={isModalVisible}
          patientId={match.params.patientId}
          closePopup={this.onClosePopup}
          careWorkerRolesFilter={addCareTeamMemberModalFilter}
        />
      );
    } else if (isExternalCareTeam) {
      return (
        <CreatePatientExternalProviderModal
          isVisible={isModalVisible}
          closePopup={this.onClosePopup}
          patientId={match.params.patientId}
        />
      );
    } else if (isFamilyAndSupportTeam) {
      const contactType = isAddingEmergencyContact ? 'emergencyContact' : 'familyMember';
      return (
        <CreatePatientContactModal
          isVisible={isModalVisible}
          closePopup={this.onClosePopup}
          patientId={match.params.patientId}
          contactType={contactType}
          onSaved={() => {
            return true;
          }}
          titleMessageId="patientContact.addFamily"
          subTitleMessageId="patientContact.familySubtitle"
        />
      );
    }
  }

  render(): JSX.Element {
    const { match } = this.props;
    const routeBase = `/patients/${match.params.patientId}/team`;
    const currentSubTab = this.getCurrentSubTab();

    const cityblockCareTeam = currentSubTab.isCityblockCareTeam ? (
      <PatientCityblockCareTeam
        patientId={match.params.patientId}
        onAddCareTeamMember={this.onClickAddRequiredCareTeamMember}
      />
    ) : null;
    const externalCareTeam = currentSubTab.isExternalCareTeam ? (
      <PatientExternalTeam patientId={match.params.patientId} />
    ) : null;
    const familyAndSupportTeam = currentSubTab.isFamilyAndSupportTeam ? (
      <PatientFamilyTeam
        patientId={match.params.patientId}
        onAddEmergencyContact={this.handleAddEmergencyContact}
      />
    ) : null;

    return (
      <React.Fragment>
        <UnderlineTabs className={styles.navBar}>
          <div>
            <UnderlineTab
              messageId="patientTeam.cityblockCareTeam"
              href={`${routeBase}/cityblock`}
              selected={currentSubTab.isCityblockCareTeam}
            />
            <UnderlineTab
              messageId="patientTeam.externalCareTeam"
              href={`${routeBase}/external`}
              selected={currentSubTab.isExternalCareTeam}
            />
            <UnderlineTab
              messageId="patientTeam.familyAndSupportTeam"
              href={`${routeBase}/family-and-support`}
              selected={currentSubTab.isFamilyAndSupportTeam}
            />
          </div>
          {this.renderAddButton()}
        </UnderlineTabs>
        <div className={styles.body}>
          {cityblockCareTeam}
          {externalCareTeam}
          {familyAndSupportTeam}
          {this.renderAddModal()}
        </div>
      </React.Fragment>
    );
  }
}

export default PatientTeam;
