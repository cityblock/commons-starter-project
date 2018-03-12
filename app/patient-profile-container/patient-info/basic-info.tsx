import * as classNames from 'classnames';
import * as langs from 'langs';
import { values } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as computedPatientStatusQuery from '../../graphql/queries/get-patient-computed-patient-status.graphql';
import {
  getPatientComputedPatientStatusQuery,
  getPatientQuery,
  BirthSexOptions,
  Gender,
} from '../../graphql/types';
import { ISavedAddress } from '../../shared/address-modal/address-modal';
import FormLabel from '../../shared/library/form-label/form-label';
import Option from '../../shared/library/option/option';
import Select, { Color } from '../../shared/library/select/select';
import TextInput from '../../shared/library/text-input/text-input';
import AddressInfo from './address-info/address-info';
import * as styles from './css/patient-demographics.css';
import { IEditableFieldState } from './patient-info';

export interface IBasicInfo {
  patientId: string;
  patientInfoId: string;
  gender: getPatientQuery['patient']['patientInfo']['gender'];
  language: getPatientQuery['patient']['patientInfo']['language'];
  primaryAddress?: ISavedAddress | null;
  addresses?: ISavedAddress[];
  isMarginallyHoused?: getPatientQuery['patient']['patientInfo']['isMarginallyHoused'];
  preferredName?: getPatientQuery['patient']['patientInfo']['preferredName'];
  sexAtBirth?: getPatientQuery['patient']['patientInfo']['sexAtBirth'];
}

interface IProps {
  patientInformation: IBasicInfo;
  onChange: (fields: IEditableFieldState) => void;
  className?: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string | null;
  computedPatientStatus?: getPatientComputedPatientStatusQuery['patientComputedPatientStatus'];
}

type allProps = IGraphqlProps & IProps;

export class BasicInfo extends React.Component<allProps> {
  constructor(props: allProps) {
    super(props);
    this.state = { isModalVisible: false };
  }

  handleValueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { onChange } = this.props;
    const { name, value } = event.target;
    onChange({ [name]: value });
  };

  handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const { name, checked } = event.target;
    onChange({ [name]: checked });
  };

  renderLanguageSelect(color?: Color) {
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
        color={color}
      >
        {languageOptions}
      </Select>
    );
  }

  renderPatientInfo() {
    const { computedPatientStatus, patientInformation } = this.props;
    const { gender, sexAtBirth, preferredName } = patientInformation;

    const isUnsaved = computedPatientStatus
      ? !computedPatientStatus.isDemographicInfoUpdated
      : false;
    const unsavedClassname = classNames({
      [styles.unsaved]: isUnsaved,
    });
    const color = isUnsaved ? 'blue' : undefined;

    return (
      <div className={styles.subSection}>
        <div className={classNames(styles.field, styles.short)}>
          <FormLabel messageId="patientInfo.preferredName" />
          <TextInput
            name="preferredName"
            value={preferredName || ''}
            onChange={this.handleValueChange}
            className={unsavedClassname}
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="patientInfo.maritalStatus" />
            <Select
              name="maritalStatus"
              large={true}
              onChange={this.handleValueChange}
              value=""
              color={color}
            />
          </div>

          <div className={styles.field}>
            <FormLabel messageId="patientInfo.language" />
            {this.renderLanguageSelect(color)}
          </div>
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
              className={unsavedClassname}
              color={color}
            />
          </div>

          <div className={styles.field}>
            <FormLabel messageId="patientInfo.sexAtBirth" />
            <Select
              name="sexAtBirth"
              large={true}
              onChange={this.handleValueChange}
              value={sexAtBirth || ''}
              options={values(BirthSexOptions)}
              hasPlaceholder={true}
              className={unsavedClassname}
              color={color}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { patientInformation, onChange } = this.props;
    const {
      primaryAddress,
      addresses,
      patientId,
      patientInfoId,
      isMarginallyHoused,
    } = patientInformation;

    return (
      <div className={styles.section}>
        <FormattedMessage id="basicInfo.sectionTitle">
          {(message: string) => <h2>{message}</h2>}
        </FormattedMessage>
        {this.renderPatientInfo()}
        <AddressInfo
          patientId={patientId}
          patientInfoId={patientInfoId}
          primaryAddress={primaryAddress}
          addresses={addresses}
          onChange={onChange}
          isMarginallyHoused={isMarginallyHoused}
        />
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(computedPatientStatusQuery as any, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientInformation.patientId,
    },
  }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    computedPatientStatus: data ? (data as any).patientComputedPatientStatus : null,
  }),
})(BasicInfo);
