import { ApolloError } from 'apollo-client';
import classNames from 'classnames';
import { filter } from 'lodash';
import { Fragment } from 'react';
import React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import computedPatientStatusGraphql from '../graphql/queries/get-patient-computed-patient-status.graphql';
import { getPatientComputedPatientStatus } from '../graphql/types';
import Button from '../shared/library/button/button';
import Icon from '../shared/library/icon/icon';
import Text from '../shared/library/text/text';
import styles from './css/patient-intake-checklist.css';
import PatientIntakeChecklistItem from './patient-intake-checklist-item';

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
  computedPatientStatus?: getPatientComputedPatientStatus['patientComputedPatientStatus'];
}

type allProps = IGraphqlProps & IProps;

interface IState {
  expanded: boolean;
}

export class PatientIntakeChecklist extends React.Component<allProps, IState> {
  state = { expanded: false };

  onClick = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  onChecklistItemClick = () => {
    this.setState({ expanded: false });
  };

  isChecklistComplete() {
    const { computedPatientStatus } = this.props;

    if (!computedPatientStatus) {
      return true;
    }

    const {
      isCoreIdentityVerified,
      isDemographicInfoUpdated,
      isEmergencyContactAdded,
      isAdvancedDirectivesAdded,
      isFullConsentSigned,
      isPhotoAddedOrDeclined,
    } = computedPatientStatus;

    return (
      isCoreIdentityVerified &&
      isDemographicInfoUpdated &&
      isEmergencyContactAdded &&
      isAdvancedDirectivesAdded &&
      isFullConsentSigned &&
      isPhotoAddedOrDeclined
    );
  }

  getCompletionText() {
    const { computedPatientStatus } = this.props;

    if (!computedPatientStatus) {
      return '0 out of 6 sections completed';
    }

    const {
      isCoreIdentityVerified,
      isDemographicInfoUpdated,
      isEmergencyContactAdded,
      isAdvancedDirectivesAdded,
      isFullConsentSigned,
      isPhotoAddedOrDeclined,
    } = computedPatientStatus;

    const checklistItems = [
      isCoreIdentityVerified,
      isDemographicInfoUpdated,
      isEmergencyContactAdded,
      isAdvancedDirectivesAdded,
      isFullConsentSigned,
      isPhotoAddedOrDeclined,
    ];

    const completedChecklistItems = filter(checklistItems, checklistItem => !!checklistItem);

    return `${completedChecklistItems.length} out of 6 sections completed`;
  }

  renderChecklistItems() {
    const { computedPatientStatus, patientId } = this.props;

    if (!computedPatientStatus) {
      return null;
    }

    const {
      isCoreIdentityVerified,
      isDemographicInfoUpdated,
      isEmergencyContactAdded,
      isAdvancedDirectivesAdded,
      isFullConsentSigned,
      isPhotoAddedOrDeclined,
    } = computedPatientStatus;

    return (
      <Fragment>
        <PatientIntakeChecklistItem
          isCompleted={isCoreIdentityVerified}
          labelId="patientIntakeChecklist.coreIdentityLabel"
          subtextId="patientIntakeChecklist.coreIdentitySubtext"
          buttonTextId="patientIntakeChecklist.coreIdentityButton"
          buttonLink={`/patients/${patientId}/member-info`}
          onClick={this.onChecklistItemClick}
        />
        <PatientIntakeChecklistItem
          isCompleted={isDemographicInfoUpdated}
          labelId="patientIntakeChecklist.demographicInfoLabel"
          subtextId="patientIntakeChecklist.demographicInfoSubtext"
          buttonTextId="patientIntakeChecklist.demographicInfoButton"
          buttonLink={`/patients/${patientId}/member-info#basic`}
          onClick={this.onChecklistItemClick}
        />
        <PatientIntakeChecklistItem
          isCompleted={isEmergencyContactAdded}
          labelId="patientIntakeChecklist.emergencyContactLabel"
          subtextId="patientIntakeChecklist.emergencyContactSubtext"
          buttonTextId="patientIntakeChecklist.emergencyContactButton"
          buttonLink={`/patients/${patientId}/team/family-and-support`}
          onClick={this.onChecklistItemClick}
        />
        <PatientIntakeChecklistItem
          isCompleted={isAdvancedDirectivesAdded}
          labelId="patientIntakeChecklist.advancedDirectivesLabel"
          subtextId="patientIntakeChecklist.advancedDirectivesSubtext"
          buttonTextId="patientIntakeChecklist.advancedDirectivesButton"
          buttonLink={`/patients/${patientId}/member-info#advancedDirectives`}
          onClick={this.onChecklistItemClick}
        />
        <PatientIntakeChecklistItem
          isCompleted={isFullConsentSigned}
          labelId="patientIntakeChecklist.consentSignedLabel"
          subtextId="patientIntakeChecklist.consentSignedSubtext"
          buttonTextId="patientIntakeChecklist.consentSignedButton"
          buttonLink={`/patients/${patientId}/member-info/documents`}
          onClick={this.onChecklistItemClick}
        />
        <PatientIntakeChecklistItem
          isCompleted={isPhotoAddedOrDeclined}
          labelId="patientIntakeChecklist.photoUploadedLabel"
          subtextId="patientIntakeChecklist.photoUploadedSubtext"
          buttonTextId="patientIntakeChecklist.photoUploadedButton"
          buttonLink={`/patients/${patientId}/member-info#photo`}
          onClick={this.onChecklistItemClick}
        />
      </Fragment>
    );
  }

  render() {
    const { expanded } = this.state;
    const isChecklistComplete = this.isChecklistComplete();

    const checklistClasses = classNames(styles.checklist, {
      [styles.hidden]: isChecklistComplete,
    });
    const checklistDrawerClasses = classNames(styles.checklistDrawer, {
      [styles.hidden]: isChecklistComplete,
      [styles.expanded]: expanded,
    });
    const buttonMessageId = expanded
      ? 'patientIntakeChecklist.closeChecklist'
      : 'patientIntakeChecklist.openChecklist';

    return (
      <div className={checklistClasses}>
        <div className={styles.checklistContent}>
          <div className={checklistDrawerClasses}>
            <div className={styles.checklistHeader}>
              <FormattedMessage id="patientIntakeChecklist.headerText">
                {(message: string) => <h2 className={styles.checklistHeaderText}>{message}</h2>}
              </FormattedMessage>
            </div>
            {this.renderChecklistItems()}
          </div>
          <div className={styles.checklistBanner}>
            <div className={styles.checklistBannerLabel}>
              <Icon name="report" color="white" isLarge={true} />
              <div className={styles.checklistBannerText}>
                <Text
                  messageId="patientIntakeChecklist.bannerLabel"
                  color="white"
                  size="large"
                  isBold={true}
                />
                <Text text={this.getCompletionText()} color="white" />
              </div>
            </div>
            <Button messageId={buttonMessageId} color="white" onClick={this.onClick} />
          </div>
        </div>
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
})(PatientIntakeChecklist);
