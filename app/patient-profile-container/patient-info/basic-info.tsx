import { ApolloError } from 'apollo-client';
import classNames from 'classnames';
import langs from 'langs';
import { isNil, pick, values } from 'lodash';
import React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import computedPatientStatusGraphql from '../../graphql/queries/get-patient-computed-patient-status.graphql';
import {
  getPatient,
  getPatientComputedPatientStatus,
  Gender,
  MaritalStatus,
  Transgender,
} from '../../graphql/types';
import { ISavedAddress } from '../../shared/address-modal/address-modal';
import CheckboxGroup from '../../shared/library/checkbox-group/checkbox-group';
import CheckboxInput from '../../shared/library/checkbox-input/checkbox-input';
import FormLabel from '../../shared/library/form-label/form-label';
import Option from '../../shared/library/option/option';
import Select, { Color } from '../../shared/library/select/select';
import TextInput from '../../shared/library/text-input/text-input';
import AddressInfo from './address-info/address-info';
import styles from './css/patient-demographics.css';
import { IEditableFieldState } from './patient-info';

export interface IBasicInfo {
  gender: getPatient['patient']['patientInfo']['gender'];
  genderFreeText: getPatient['patient']['patientInfo']['genderFreeText'];
  transgender: getPatient['patient']['patientInfo']['transgender'];
  maritalStatus: getPatient['patient']['patientInfo']['maritalStatus'];
  language: getPatient['patient']['patientInfo']['language'];
  primaryAddress?: ISavedAddress | null;
  addresses?: ISavedAddress[];
  isMarginallyHoused?: getPatient['patient']['patientInfo']['isMarginallyHoused'];
  preferredName?: getPatient['patient']['patientInfo']['preferredName'];
  isWhite: getPatient['patient']['patientInfo']['isWhite'];
  isBlack: getPatient['patient']['patientInfo']['isBlack'];
  isAmericanIndianAlaskan: getPatient['patient']['patientInfo']['isAmericanIndianAlaskan'];
  isAsian: getPatient['patient']['patientInfo']['isAsian'];
  isHawaiianPacific: getPatient['patient']['patientInfo']['isHawaiianPacific'];
  isOtherRace: getPatient['patient']['patientInfo']['isOtherRace'];
  isHispanic?: getPatient['patient']['patientInfo']['isHispanic'];
  raceFreeText?: getPatient['patient']['patientInfo']['raceFreeText'];
}

interface IProps {
  patientInformation: IBasicInfo;
  patientId: string;
  patientInfoId: string;
  onChange: (fields: IEditableFieldState) => void;
  className?: string;
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
  computedPatientStatus?: getPatientComputedPatientStatus['patientComputedPatientStatus'];
}

type allProps = IGraphqlProps & IProps;

export class BasicInfo extends React.Component<allProps> {
  state = { isModalVisible: false };

  handleValueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { onChange } = this.props;
    const { name, value } = event.target;
    onChange({ [name]: value });
  };

  handleBooleanSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { onChange } = this.props;
    const { name, value } = event.target;
    onChange({ [name]: value === 'true' ? true : false });
  };

  handleGenderChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { onChange, patientInformation } = this.props;
    const gender = event.target.value as any;
    const genderFreeText = gender === Gender.selfDescribed ? patientInformation.genderFreeText : '';

    onChange({ gender, genderFreeText });
  };

  handleRaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange, patientInformation } = this.props;
    const { value, checked } = event.target;
    const raceFreeText = value === 'isOtherRace' && checked ? patientInformation.raceFreeText : '';

    onChange({ [value]: checked, raceFreeText });
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

  renderRaceOptions() {
    const options = pick(this.props.patientInformation, [
      'isWhite',
      'isBlack',
      'isAmericanIndianAlaskan',
      'isAsian',
      'isHawaiianPacific',
      'isOtherRace',
    ]);

    const raceOptionsHtml = Object.keys(options).map(race => {
      return (
        <CheckboxInput
          key={`raceCheckbox-${race}`}
          value={race}
          checked={!!(options as any)[race]}
          onChange={this.handleRaceChange}
          labelMessageId={`race.${race}`}
        />
      );
    });
    return <CheckboxGroup>{raceOptionsHtml}</CheckboxGroup>;
  }

  renderPatientInfo() {
    const { computedPatientStatus, patientInformation } = this.props;
    const {
      gender,
      genderFreeText,
      transgender,
      maritalStatus,
      preferredName,
      isOtherRace,
      raceFreeText,
      isHispanic,
    } = patientInformation;

    const isUnsaved = computedPatientStatus
      ? !computedPatientStatus.isDemographicInfoUpdated
      : false;
    const unsavedClassname = classNames({
      [styles.unsaved]: isUnsaved,
    });
    const color = isUnsaved ? 'blue' : undefined;

    const genderFreeTextHtml =
      gender === Gender.selfDescribed ? (
        <div className={classNames(styles.field, styles.short)}>
          <FormLabel messageId="patientInfo.genderFreeText" />
          <TextInput
            name="genderFreeText"
            value={genderFreeText || ''}
            onChange={this.handleValueChange}
          />
        </div>
      ) : null;

    const raceFreeTextHtml = isOtherRace ? (
      <div className={styles.field}>
        <FormLabel messageId="patientInfo.raceFreeText" />
        <TextInput
          name="raceFreeText"
          value={raceFreeText || ''}
          onChange={this.handleValueChange}
        />
      </div>
    ) : null;

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
              value={maritalStatus || ''}
              options={values(MaritalStatus)}
              hasPlaceholder={true}
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
              onChange={this.handleGenderChange}
              value={gender || ''}
              options={values(Gender)}
              hasPlaceholder={true}
              className={unsavedClassname}
              color={color}
            />
          </div>

          {genderFreeTextHtml}

          <div className={styles.field}>
            <FormLabel messageId="patientInfo.transgender" />
            <Select
              name="transgender"
              large={true}
              onChange={this.handleValueChange}
              value={transgender || ''}
              options={values(Transgender)}
              hasPlaceholder={true}
              color={color}
            />
          </div>
        </div>

        <div className={styles.field}>
          <FormLabel messageId="patientInfo.race" />
          {this.renderRaceOptions()}
        </div>

        <div className={styles.fieldRow}>
          <div className={classNames(styles.field, styles.short)}>
            <FormLabel messageId="patientInfo.isHispanic" />
            <Select
              name="isHispanic"
              large={true}
              onChange={this.handleBooleanSelectChange}
              value={isNil(isHispanic) ? '' : isHispanic.toString()}
              options={['true', 'false']}
              hasPlaceholder={true}
              color={color}
            />
          </div>
          {raceFreeTextHtml}
        </div>
      </div>
    );
  }

  render() {
    const { patientInformation, onChange, patientId, patientInfoId } = this.props;
    const { primaryAddress, isMarginallyHoused } = patientInformation;

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
          onChange={onChange}
          isMarginallyHoused={isMarginallyHoused}
        />
      </div>
    );
  }
}

export default graphql(computedPatientStatusGraphql, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
    fetchPolicy: 'network-only',
  }),
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    computedPatientStatus: data ? (data as any).patientComputedPatientStatus : null,
  }),
})(BasicInfo);
