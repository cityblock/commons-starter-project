import * as classNames from 'classnames';
import * as React from 'react';
import { Gender, PatientFilterOptions } from '../graphql/types';
import Button from '../shared/library/button/button';
import FormLabel from '../shared/library/form-label/form-label';
import RadioGroup from '../shared/library/radio-group/radio-group';
import RadioInput from '../shared/library/radio-input/radio-input';
import TextInput from '../shared/library/text-input/text-input';
import AgeRangeSelect, { IAgeChangeOptions } from './age-range-select';
import CareWorkerSelect from './care-worker-select';
import * as styles from './css/patient-filter-panel.css';
import { FilterSelect } from './filter-select';

interface IProps {
  onCancelClick: () => any;
  onApplyClick: (filters: PatientFilterOptions) => any;
  isVisible: boolean | null;
}

interface IState {
  ageIndex: number | null;
  ageMin: number | null;
  ageMax: number | null;
  gender: Gender | null;
  zip: string | null;
  inNetwork: string | null;
  careWorkerId: string | null;
}

export default class PatientPanelContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      ageIndex: null,
      ageMin: null,
      ageMax: null,
      gender: null,
      zip: null,
      inNetwork: null,
      careWorkerId: null,
    };
  }

  handleAgeRangeChange = (options: IAgeChangeOptions) => {
    this.setState({
      ageIndex: options.index,
      ageMin: options.ageMin,
      ageMax: options.ageMax,
    });
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    this.setState({ [event.target.name as any]: event.target.value });
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
    const { gender, ageMin, ageMax, zip, careWorkerId } = this.state;
    this.props.onApplyClick({
      gender,
      ageMin,
      ageMax,
      zip,
      careWorkerId,
    });
  };

  render() {
    const { onCancelClick, isVisible } = this.props;
    const { ageIndex, gender, zip, inNetwork, careWorkerId } = this.state;

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
              onClick={onCancelClick}
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
              value={ageIndex}
            />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.gender" />
            <FilterSelect
              name="gender"
              isLarge={true}
              isUnselectable={true}
              onChange={this.handleChange}
              value={gender}
              options={Object.values(Gender)}
            />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.location" />
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
