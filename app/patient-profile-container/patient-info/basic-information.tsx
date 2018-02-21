import * as classNames from 'classnames';
import * as langs from 'langs';
import { values } from 'lodash-es';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { getPatientQuery, Gender } from '../../graphql/types';
import { ISavedAddress } from '../../shared/address-modal/address-modal';
import FormLabel from '../../shared/library/form-label/form-label';
import Option from '../../shared/library/option/option';
import Select from '../../shared/library/select/select';
import TextInput from '../../shared/library/text-input/text-input';
import AddressInformation from './address-info/address-info';
import * as styles from './css/patient-demographics.css';

export interface IBasicInformation {
  patientId: string;
  patientInfoId: string;
  gender: getPatientQuery['patient']['patientInfo']['gender'];
  language: getPatientQuery['patient']['patientInfo']['language'];
  primaryAddress?: ISavedAddress | null;
  addresses?: ISavedAddress[];
}

interface IProps {
  patientInformation: IBasicInformation;
  onChange: (field: { name: string; value: string | object | boolean | null }) => void;
  className?: string;
}

export default class BasicInformation extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.state = { isModalVisible: false };
  }

  handleValueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { onChange } = this.props;
    const { name, value } = event.target;
    onChange({ name, value });
  };

  handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const { name, checked } = event.target;
    onChange({ name, value: checked });
  };

  renderLanguageSelect() {
    const { language } = this.props.patientInformation;
    const languageOptions = langs
      .all()
      .map((lang: langs.Language) => (
        <Option key={lang['1']} value={lang['1']} label={lang.name} />
      ));

    return (
      <Select
        name="language"
        value={language || ''}
        onChange={this.handleValueChange}
        hasPlaceholder={true}
        large={true}
      >
        {languageOptions}
      </Select>
    );
  }

  renderPatientInfo() {
    const { gender } = this.props.patientInformation;

    return (
      <div className={styles.subSection}>
        <div className={classNames(styles.field, styles.short)}>
          <FormLabel messageId="patientInfo.preferredName" />
          <TextInput name="preferredName" value="" onChange={this.handleValueChange} />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="patientInfo.gender" />
            <Select
              name="gender"
              large={true}
              onChange={this.handleValueChange}
              value={gender || ''}
              options={values(Gender)}
              hasPlaceholder={true}
            />
          </div>

          <div className={styles.field}>
            <FormLabel messageId="patientInfo.maritalStatus" />
            <Select name="maritalStatus" large={true} onChange={this.handleValueChange} value="" />
          </div>

          <div className={styles.field}>
            <FormLabel messageId="patientInfo.language" />
            {this.renderLanguageSelect()}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { patientInformation, onChange } = this.props;
    const { primaryAddress, addresses, patientId, patientInfoId } = patientInformation;

    return (
      <div className={styles.section}>
        <FormattedMessage id="basicInformation.sectionTitle">
          {(message: string) => <h2>{message}</h2>}
        </FormattedMessage>
        {this.renderPatientInfo()}
        <AddressInformation
          patientId={patientId}
          patientInfoId={patientInfoId}
          primaryAddress={primaryAddress}
          addresses={addresses}
          onChange={onChange}
        />
      </div>
    );
  }
}
