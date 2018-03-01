import * as React from 'react';
import Button from '../../shared/library/button/button';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import PatientCityblockCareTeam from './patient-cityblock-care-team';
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

export class PatientTeam extends React.Component<IProps> {
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

  renderAddButton() {
    const currentSubTab = this.getCurrentSubTab();
    let messageId = 'patientTeam.addCityblockCareTeamButton';

    if (currentSubTab.isExternalCareTeam) {
      messageId = 'patientTeam.addExternalCareTeamButton';
    } else if (currentSubTab.isFamilyAndSupportTeam) {
      messageId = 'patientTeam.addFamilyAndSupportTeamButton';
    }

    return <Button messageId={messageId} onClick={() => true} />;
  }

  render(): JSX.Element {
    const { match } = this.props;
    const routeBase = `/patients/${match.params.patientId}/team`;
    const currentSubTab = this.getCurrentSubTab();

    const cityblockCareTeam = currentSubTab.isCityblockCareTeam ? (
      <PatientCityblockCareTeam patientId={match.params.patientId} />
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
        </div>
      </div>
    );
  }
}

export default PatientTeam;
