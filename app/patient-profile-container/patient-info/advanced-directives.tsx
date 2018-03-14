import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { Link as ReactRouterLink } from 'react-router-dom';
import * as healthcareProxiesQuery from '../../graphql/queries/get-patient-contact-healthcare-proxies.graphql';
import {
  getPatientContactHealthcareProxiesQuery,
  FullPatientContactFragment,
} from '../../graphql/types';
import { formatFullName } from '../../shared/helpers/format-helpers';
import Button from '../../shared/library/button/button';
import DefaultText from '../../shared/library/default-text/default-text';
import FormLabel from '../../shared/library/form-label/form-label';
import Icon from '../../shared/library/icon/icon';
import RadioGroup from '../../shared/library/radio-group/radio-group';
import RadioInput from '../../shared/library/radio-input/radio-input';
import CreatePatientContactModal from '../../shared/patient-contact-modal/create-patient-contact-modal';
import EditPatientContactModal from '../../shared/patient-contact-modal/edit-patient-contact-modal';
import * as styles from './css/advanced-directives.css';
import * as parentStyles from './css/patient-demographics.css';
import DisplayCard from './display-card';
import { IEditableFieldState } from './patient-info';

export interface IAdvancedDirectives {
  patientId: string;
}

interface IProps {
  advancedDirectives: IAdvancedDirectives;
  onChange: (fields: IEditableFieldState) => void;
  routeBase: string;
}

interface IGraphqlProps {
  healthcareProxies?: getPatientContactHealthcareProxiesQuery['patientContactHealthcareProxies'];
}

type allProps = IProps & IGraphqlProps;

interface IState {
  hasProxiesChecked: boolean;
  isEditModalVisible: boolean;
  isCreateModalVisible: boolean;
  currentProxy: FullPatientContactFragment | null;
  updatedHealthcareProxies: FullPatientContactFragment[] | null;
}

export class AdvancedDirectives extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    const { healthcareProxies } = props;
    this.state = {
      hasProxiesChecked: !!(healthcareProxies && healthcareProxies.length),
      isEditModalVisible: false,
      isCreateModalVisible: false,
      currentProxy: null,
      updatedHealthcareProxies: null,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    if (nextProps.healthcareProxies && nextProps.healthcareProxies.length) {
      this.setState({ hasProxiesChecked: true });
    }
  }

  handleHasProxiesChange = () => {
    this.setState({ hasProxiesChecked: true, isCreateModalVisible: true });
  };

  handleAddProxyClick = () => {
    this.setState({ isCreateModalVisible: true });
  };

  handleProxyDelete = (proxyId: string) => {
    // TODO: implement this
  };

  handleModalClose = () => {
    this.setState({ isEditModalVisible: false, isCreateModalVisible: false, currentProxy: null });
  };

  handleCreateSuccess = (savedProxy: FullPatientContactFragment) => {
    const { healthcareProxies } = this.props;
    const { updatedHealthcareProxies } = this.state;

    const currentProxies = updatedHealthcareProxies || healthcareProxies || [];
    const updatedProxies = [...currentProxies, savedProxy];
    this.setState({ updatedHealthcareProxies: updatedProxies });
  };

  handleEditSuccess = (savedProxy: FullPatientContactFragment) => {
    const { healthcareProxies } = this.props;
    const { updatedHealthcareProxies } = this.state;

    const currentProxies = updatedHealthcareProxies || healthcareProxies || [];
    const index = currentProxies.findIndex(proxy => proxy.id === savedProxy.id);

    if (index > -1) {
      const updatedProxies = [...currentProxies];
      updatedProxies[index] = savedProxy;
      this.setState({ updatedHealthcareProxies: updatedProxies });
    }
  };

  handleOpenEditModal = (proxy: FullPatientContactFragment) => {
    this.setState({ isEditModalVisible: true, currentProxy: proxy });
  };

  renderHealthcareProxyCard = (proxy: FullPatientContactFragment) => {
    const emailHtml = proxy.email ? <p>{proxy.email.emailAddress}</p> : <p>Unknown Email</p>;
    const phoneHtml = proxy.phone ? <p>{proxy.phone.phoneNumber}</p> : <p>Unknown Phone</p>;
    return (
      <DisplayCard
        onEditClick={() => this.handleOpenEditModal(proxy)}
        onDeleteClick={() => this.handleProxyDelete(proxy.id)}
        key={`card-${proxy.id}`}
        className={styles.fieldMargin}
      >
        <div className={styles.proxyFieldRow}>
          <div className={styles.proxyField}>
            <h4 className={styles.proxyName}>{formatFullName(proxy.firstName, proxy.lastName)}</h4>
            <p className={styles.gray}>{proxy.relationToPatient}</p>
          </div>
          <div className={styles.proxyField}>
            {phoneHtml}
            {emailHtml}
          </div>
          <div className={classNames(styles.proxyField, styles.gray)}>{proxy.description}</div>
        </div>
      </DisplayCard>
    );
  };

  renderDocumentsLink(messageId: string) {
    const { routeBase } = this.props;

    return (
      <ReactRouterLink to={`${routeBase}/documents`} className={styles.buttonLinkContainer}>
        <DefaultText messageId={messageId} className={styles.buttonLink} />
        <div className={styles.noShrink}>
          <DefaultText
            messageId="advancedDirectives.documents"
            color="lightGray"
            className={styles.buttonLinkDescriptor}
          />
          <Icon name="keyboardArrowRight" color="gray" className={styles.buttonIcon} />
        </div>
      </ReactRouterLink>
    );
  }

  renderEditModal() {
    const { patientId } = this.props.advancedDirectives;
    const { isEditModalVisible, currentProxy } = this.state;

    if (currentProxy) {
      return (
        <EditPatientContactModal
          isVisible={isEditModalVisible}
          closePopup={this.handleModalClose}
          patientContact={currentProxy}
          patientId={patientId}
          contactType="healthcareProxy"
          onSaved={this.handleEditSuccess}
          titleMessageId="patientContact.editHealthcareProxy"
        />
      );
    }

    return null;
  }

  render() {
    const { healthcareProxies, advancedDirectives } = this.props;
    const { patientId } = advancedDirectives;
    const { hasProxiesChecked, isCreateModalVisible, updatedHealthcareProxies } = this.state;

    const currentProxies = updatedHealthcareProxies || healthcareProxies;
    const hasProxiesSaved = !!(currentProxies && currentProxies.length);
    const canAddProxies = hasProxiesSaved && currentProxies!.length === 1;

    const addProxyButton = canAddProxies ? (
      <Button
        className={styles.addButton}
        onClick={this.handleAddProxyClick}
        fullWidth={true}
        messageId="advancedDirectives.addProxy"
      />
    ) : null;

    const proxyCards = currentProxies ? currentProxies.map(this.renderHealthcareProxyCard) : null;
    const proxyFormsLink = hasProxiesSaved
      ? this.renderDocumentsLink('advancedDirectives.proxyForms')
      : null;

    return (
      <div className={parentStyles.section}>
        <CreatePatientContactModal
          isVisible={isCreateModalVisible}
          closePopup={this.handleModalClose}
          patientId={patientId}
          contactType="healthcareProxy"
          onSaved={this.handleCreateSuccess}
          titleMessageId="patientContact.addHealthcareProxy"
        />
        {this.renderEditModal()}
        <div className={parentStyles.field}>
          <FormLabel messageId="advancedDirectives.hasProxy" />
          <RadioGroup>
            <RadioInput
              name="hasProxiesChecked"
              value="false"
              checked={!hasProxiesChecked}
              label="No"
              onChange={this.handleHasProxiesChange}
              disabled={hasProxiesSaved}
            />
            <RadioInput
              name="hasProxiesChecked"
              value="true"
              checked={hasProxiesChecked}
              label="Yes"
              onChange={this.handleHasProxiesChange}
              disabled={hasProxiesSaved}
            />
          </RadioGroup>
        </div>
        {proxyCards}
        {proxyFormsLink}
        {addProxyButton}
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(healthcareProxiesQuery as any, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.advancedDirectives.patientId,
    },
  }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    healthcareProxies: data ? (data as any).patientContactHealthcareProxies : null,
  }),
})(AdvancedDirectives);
