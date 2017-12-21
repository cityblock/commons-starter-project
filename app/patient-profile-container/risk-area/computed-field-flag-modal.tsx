import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { closePopup as closePopupAction } from '../../actions/popup-action';
/* tslint:disable:max-line-length */
import * as computedFieldFlagCreateMutationGraphql from '../../graphql/queries/computed-field-flag-create-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  computedFieldFlagCreateMutation,
  computedFieldFlagCreateMutationVariables,
} from '../../graphql/types';
import { IComputedFieldFlagPopupOptions } from '../../reducers/popup-reducer';
import FormLabel from '../../shared/library/form-label/form-label';
import ModalButtons from '../../shared/library/modal-buttons/modal-buttons';
import ModalHeader from '../../shared/library/modal-header/modal-header';
import Spinner from '../../shared/library/spinner/spinner';
import TextArea from '../../shared/library/textarea/textarea';
import { Popup } from '../../shared/popup/popup';
import { IState as IAppState } from '../../store';
import * as styles from './css/computed-field-flag-modal.css';

interface IStateProps {
  visible: boolean;
  patientAnswerIds: string[];
}

interface IDispatchProps {
  closePopup: () => void;
}

interface IGraphqlProps {
  flagComputedField: (
    options: { variables: computedFieldFlagCreateMutationVariables },
  ) => { data: computedFieldFlagCreateMutation };
}

type allProps = IStateProps & IDispatchProps & IGraphqlProps;

interface IState {
  reason: string;
  complete: boolean;
  loading: boolean;
  error: string | null;
}

export class ComputedFieldFlagModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = { reason: '', complete: false, loading: false, error: null };
  }

  onReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ reason: e.currentTarget.value });
  };

  submitFlag = async (patientAnswerId: string) => {
    const { flagComputedField } = this.props;
    const { reason } = this.state;
    await flagComputedField({ variables: { patientAnswerId, reason } });
  }

  onSubmit = async () => {
    const { patientAnswerIds, closePopup } = this.props;
    const { loading } = this.state;

    if (!loading) {
      this.setState({ loading: true, error: null });

      try {
        const promises = patientAnswerIds.map(this.submitFlag);
        await Promise.all(promises);
        this.setState({ reason: '' });
        closePopup();
      } catch (err) {
        this.setState({ error: err.message });
      }
    }

    this.setState({ loading: false });
  };

  render(): JSX.Element {
    const { visible, closePopup } = this.props;
    const { reason, complete, loading } = this.state;

    if (loading) return <Spinner />;

    const fields = loading ? (
      <Spinner />
    ) : (
      <div>
        <FormLabel messageId="computedField.reason" gray={!!reason && complete} />
        <TextArea
          value={reason}
          onChange={this.onReasonChange}
          placeholderMessageId="computedField.reasonDetail"
          onBlur={() => this.setState({ complete: true })}
          onFocus={() => this.setState({ complete: false })}
        />
        <ModalButtons cancel={closePopup} submit={this.onSubmit} />
      </div>
    );

    return (
      <Popup visible={visible} closePopup={closePopup} style="no-padding" className={styles.popup}>
        <ModalHeader
          titleMessageId="computedField.flag"
          bodyMessageId="computedField.flagDetail"
          closePopup={closePopup}
        />
        <div className={styles.fields}>{fields}</div>
      </Popup>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  const visible = state.popup.name === 'COMPUTED_FIELD_FLAG';
  const options = state.popup.options as IComputedFieldFlagPopupOptions;
  const patientAnswerIds = visible ? options.patientAnswerIds : [];

  return { visible, patientAnswerIds };
};

const mapDispatchToProps = (dispatch: Dispatch<() => void>): IDispatchProps => {
  const closePopup = () => dispatch(closePopupAction());
  return { closePopup };
};

export default compose(
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
  graphql<IGraphqlProps, {}, allProps>(computedFieldFlagCreateMutationGraphql as any, {
    name: 'flagComputedField',
  }),
)(ComputedFieldFlagModal);
