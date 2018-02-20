import * as classNames from 'classnames';
import { values } from 'lodash-es';
import * as React from 'react';
import { Gender, PatientFilterOptions } from '../graphql/types';
import Button from '../shared/library/button/button';
import FormLabel from '../shared/library/form-label/form-label';
import RadioGroup from '../shared/library/radio-group/radio-group';
import RadioInput from '../shared/library/radio-input/radio-input';
import Select from '../shared/library/select/select';
import TextInput from '../shared/library/text-input/text-input';
import AgeRangeSelect, { formatAgeValue } from './age-range-select';
import CareWorkerSelect from './care-worker-select';
import * as styles from './css/patient-filter-panel.css';

interface IProps {
  onClick: (filters: PatientFilterOptions) => any;
  onChange: (filter: PatientFilterOptions) => any;
  filters: PatientFilterOptions;
  isVisible: boolean | null;
}

interface IState {
  inNetwork: string;
}

export default class PatientFilterPanel extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      inNetwork: 'false',
    };
  }

  handleAgeRangeChange = (options: PatientFilterOptions) => {
    this.props.onChange(options);
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    this.props.onChange({ [event.target.name as any]: event.target.value });
  };

  handleNetworkToggleChange = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    let fieldValue: any = target.value;

    if (this.state.inNetwork === fieldValue) {
      fieldValue = null;
    }

    this.setState({ inNetwork: fieldValue });
  };

  handleApplyClick = () => {
    const { gender, ageMin, ageMax, zip, careWorkerId } = this.props.filters;
    this.props.onClick({
      gender,
      ageMin,
      ageMax,
      zip,
      careWorkerId,
    });
  };

  handleCancelClick = () => {
    this.props.onClick({});
  };

  render() {
    const { isVisible, filters } = this.props;
    const { gender, zip, careWorkerId, ageMin, ageMax } = filters;
    const { inNetwork } = this.state;

    return (
      <div
        className={classNames(styles.container, {
          [styles.visible]: !!isVisible,
          [styles.hidden]: isVisible === false,
        })}
      >
        <div className={styles.header}>
          <FormLabel messageId="patientFilter.title" />
          <div className={styles.buttonContainer}>
            <Button
              messageId="patientFilter.cancel"
              color="white"
              onClick={this.handleCancelClick}
              className={styles.button}
            />
            <Button
              messageId="patientFilter.apply"
              onClick={this.handleApplyClick}
              className={styles.button}
            />
          </div>
        </div>
        <div className={styles.fields}>
          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.age" />
            <AgeRangeSelect
              isLarge={true}
              isUnselectable={true}
              onChange={this.handleAgeRangeChange}
              value={formatAgeValue(ageMin || null, ageMax || null)}
            />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.gender" />
            <Select
              name="gender"
              large={true}
              isUnselectable={true}
              onChange={this.handleChange}
              value={gender || ''}
              options={values(Gender)}
            />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.zip" />
            <TextInput
              name="zip"
              value={zip || ''}
              onChange={this.handleChange}
              placeholderMessageId="patientFiler.zipPlaceholder"
            />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.careWorkerId" />
            <CareWorkerSelect
              isLarge={true}
              isUnselectable={true}
              onChange={this.handleChange}
              value={careWorkerId}
            />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.insurance" />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.inNetwork" />
            <RadioGroup>
              <RadioInput
                name="inNetwork"
                value="false"
                checked={inNetwork === 'false'}
                label="No"
                onClick={this.handleNetworkToggleChange}
                readOnly={true}
              />
              <RadioInput
                name="inNetwork"
                value="true"
                checked={inNetwork === 'true'}
                label="Yes"
                onClick={this.handleNetworkToggleChange}
              />
            </RadioGroup>
          </div>
        </div>
      </div>
    );
  }
}
