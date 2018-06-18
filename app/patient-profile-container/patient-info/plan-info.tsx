import { filter } from 'lodash';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { getPatientQuery, patientDataFlagCreateMutation } from '../../graphql/types';
import styles from './css/patient-demographics.css';
import FlaggableDisplayCard, { FooterState } from './flaggable-display-card';
import FlaggableDisplayField from './flaggable-display-field';
import FlaggingModal from './flagging-modal';
import { IEditableFieldState } from './patient-info';

export interface IPlanInfo {
  patientDataFlags: getPatientQuery['patient']['patientDataFlags'];
}

interface IProps {
  planInfo: IPlanInfo;
  onChange: (fields: IEditableFieldState) => void;
  patientId: string;
}

interface IState {
  isModalVisible: boolean;
}

export default class PlanInfo extends React.Component<IProps, IState> {
  state = { isModalVisible: false };

  hasDataFlags() {
    // TODO: fix this once we know the field names
    return false;
  }

  findFlag(fieldName: string) {
    const { patientDataFlags } = this.props.planInfo;

    if (!patientDataFlags) {
      return null;
    }

    const flagInfo = patientDataFlags.find(flag => flag.fieldName === fieldName);
    return flagInfo ? flagInfo.suggestedValue : null;
  }

  handleFlagCreation = (savedFlag: patientDataFlagCreateMutation['patientDataFlagCreate']) => {
    const { onChange, planInfo } = this.props;
    const flags = planInfo.patientDataFlags || [];

    if (savedFlag) {
      const updatedFlags = filter(flags, flag => flag.fieldName !== savedFlag.fieldName);
      updatedFlags.push(savedFlag);
      onChange({ flags: updatedFlags });
    }
  };

  handleShowModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCloseModal = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { planInfo, patientId } = this.props;
    const { patientDataFlags } = planInfo;
    const { isModalVisible } = this.state;

    let footerState: FooterState = 'none';
    let flaggedOn: string | undefined;
    if (this.hasDataFlags()) {
      footerState = 'flagged';
      patientDataFlags!.forEach(flag => {
        if (
          (flaggedOn && flag.updatedAt && flag.updatedAt > flaggedOn) ||
          (!flaggedOn && flag.updatedAt)
        ) {
          flaggedOn = flag.updatedAt;
        }
      });
    }

    return (
      <div className={styles.section}>
        <FormattedMessage id="planInfo.sectionTitle">
          {(message: string) => <h2>{message}</h2>}
        </FormattedMessage>
        <FlaggableDisplayCard
          titleMessageId="planInfo.title"
          footerState={footerState}
          onFlagClick={this.handleShowModal}
          flaggedMessageId="planInfo.flaggedDescription"
          flaggedOn={flaggedOn}
        >
          <div>
            <FlaggableDisplayField labelMessageId="planInfo.medicaidNumber" value="123456789" />
            <FlaggableDisplayField labelMessageId="planInfo.planId" value="BZ729440" />
            <FlaggableDisplayField labelMessageId="planInfo.productDescription" value="HMO" />
            <FlaggableDisplayField labelMessageId="planInfo.lineOfBusiness" value="Medicaid" />
          </div>
          <FlaggableDisplayField
            labelMessageId="planInfo.primaryCare"
            value="Mount Sinai Doctors Brooklyn"
          />
        </FlaggableDisplayCard>
        <FlaggingModal
          isVisible={isModalVisible}
          patientId={patientId}
          closePopup={this.handleCloseModal}
          onSaved={this.handleFlagCreation}
        />
      </div>
    );
  }
}
