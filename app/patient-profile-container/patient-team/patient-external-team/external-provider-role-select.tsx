import React from 'react';
import { Fragment } from 'react';
import OptGroup from '../../../shared/library/optgroup/optgroup';
import Option from '../../../shared/library/option/option';
import Select from '../../../shared/library/select/select';

interface IProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => any;
  isLarge: boolean;
  value: string | null;
  errorMessageId?: string;
  hasError?: boolean;
}

const ROLES = [
  'substanceUseCounselor',
  'therapistMentalHealth',
  'therapistPhysical',
  'psychiatrist',
  'dialysis',
  'housingCaseManager',
  'hasaCaseManager',
  'pharmacy',
  'homeAttendant',
  'visitingNurse',
  'durableMedicalEquipment',
  'healthHomeCareManager',
  'insurancePlanCareManager',
  'otherCaseManagement',
  'formalCaregiver',
  'other',
];

const MEDICAL_SPECIALIST_ROLES = [
  'urology',
  'endocrinology',
  'ophthalmology',
  'cardiology',
  'podiatry',
  'orthopedics',
  'infectiousDisease',
  'obgyn',
  'pulmonology',
  'nephrology',
  'hepatology',
  'gastroenterology',
  'ent',
  'vascular',
  'oncology',
  'hematology',
  'dermatology',
  'otherMedicalSpecialist',
];

export default class ExternalProviderRoleSelect extends React.Component<IProps> {
  renderOptions(options: string[]) {
    return options.map(option => {
      return (
        <Option
          key={`option-${option}`}
          value={option}
          messageId={`externalProviderRole.${option}`}
        />
      );
    });
  }

  renderOptionGroups() {
    const medicalSpecialists = this.renderOptions(MEDICAL_SPECIALIST_ROLES);
    const roles = this.renderOptions(ROLES);

    return (
      <Fragment>
        <OptGroup messageId="externalProviderRoleSelect.medicalSpecialist">
          {medicalSpecialists}
        </OptGroup>
        {roles}
      </Fragment>
    );
  }

  render() {
    const { isLarge, value, onChange } = this.props;

    return (
      <Select required name="role" value={value || ''} onChange={onChange} large={isLarge}>
        <Option messageId="externalProviderRoleSelect.placeholder" value="" />
        {this.renderOptionGroups()}
      </Select>
    );
  }
}
