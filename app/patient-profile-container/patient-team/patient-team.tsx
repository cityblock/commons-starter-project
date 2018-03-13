import * as React from 'react';
import Button from '../../shared/library/button/button';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import AddCareTeamMemberModal from './patient-cityblock-care-team/add-care-team-member-modal';
import PatientCityblockCareTeam from './patient-cityblock-care-team/patient-cityblock-care-team';
import PatientExternalCareTeam from './patient-external-care-team';
import PatientFamilyAndSupportTeam from './patient-family-and-support-team';

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
  addCareTeamMemberModalFilter?: AddCareTeamMemberModalFilters | null;
}

export class PatientTeam extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { isModalVisible: false };
  }

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
    this.setState({ isModalVisible: false, addCareTeamMemberModalFilter: null });
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
    const { isModalVisible, addCareTeamMemberModalFilter } = this.state;
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
      // TODO: add appropriate modal here
      return null;
    } else if (isFamilyAndSupportTeam) {
      // TODO: add appropriate modal here
      return null;
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
      <PatientExternalCareTeam patientId={match.params.patientId} />
    ) : null;
    const familyAndSupportTeam = currentSubTab.isFamilyAndSupportTeam ? (
      <PatientFamilyAndSupportTeam patientId={match.params.patientId} />
    ) : null;

    return (
      <div>
        <UnderlineTabs>
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
        <div>
          {cityblockCareTeam}
          {externalCareTeam}
          {familyAndSupportTeam}
          {this.renderAddModal()}
        </div>
      </div>
    );
  }
}

export default PatientTeam;
