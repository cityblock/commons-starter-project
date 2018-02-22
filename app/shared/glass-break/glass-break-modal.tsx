import * as React from 'react';
import FormLabel from '../library/form-label/form-label';
import ModalButtons from '../library/modal-buttons/modal-buttons';
import ModalHeader from '../library/modal-header/modal-header';
import Option from '../library/option/option';
import Select from '../library/select/select';
import TextArea from '../library/textarea/textarea';
import { Popup } from '../popup/popup';
import * as styles from './css/glass-break-modal.css';
import { reasonOptions, OTHER_VALUE } from './reason-options';

interface IProps {
  isPopupVisible: boolean;
  createGlassBreak: (reason: string, note: string | null) => any;
  closePopup: () => void;
}

interface IState {
  reason: string;
  note: string;
  loading: boolean;
  error: string | null;
}

class GlassBreakModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { reason: '', note: '', loading: false, error: null };
  }

  onSubmit = async () => {
    const { createGlassBreak } = this.props;
    const { reason, note, loading } = this.state;
    // check that if other selected, note must be provided
    const isReasonProvidedForOther = reason && (reason !== OTHER_VALUE || !!note);
    if (!loading && isReasonProvidedForOther) {
      try {
        this.setState({ loading: true, error: null });
        await createGlassBreak(reason, note || null);
        this.setState({ loading: false, error: null });
      } catch (err) {
        this.setState({ error: err.message, loading: false });
      }
    }
  };

  getOnChangeForField = (field: 'reason' | 'note') => {
    return (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.currentTarget.value;

      this.setState({ [field as any]: newValue });
    };
  };

  onClose = (): void => {
    this.setState({ reason: '', note: '' });
    this.props.closePopup();
  };

  renderReasonSelect(): JSX.Element {
    return (
      <Select value={this.state.reason} onChange={this.getOnChangeForField('reason')} large={true}>
        <Option value="" messageId="glassBreak.selectReason" disabled={true} />
        {Object.keys(reasonOptions).map((messageId, i) => (
          <Option messageId={messageId} value={reasonOptions[messageId]} key={i} />
        ))}
      </Select>
    );
  }

  render(): JSX.Element {
    const { isPopupVisible } = this.props;

    return (
      <Popup
        visible={isPopupVisible}
        closePopup={this.onClose}
        style="no-padding"
        className={styles.popup}
      >
        <ModalHeader
          titleMessageId="glassBreak.popupTitle"
          bodyMessageId="glassBreak.popupBody"
          closePopup={this.onClose}
        />
        <div className={styles.fields}>
          <FormLabel messageId="glassBreak.reason" topPadding={true} />
          {this.renderReasonSelect()}
          <FormLabel messageId="glassBreak.note" topPadding={true} />
          <TextArea
            value={this.state.note}
            onChange={this.getOnChangeForField('note')}
            placeholderMessageId="glassBreak.inputNote"
          />
          <ModalButtons
            submitMessageId="glassBreak.breakGlass"
            submit={this.onSubmit}
            cancel={this.onClose}
          />
        </div>
      </Popup>
    );
  }
}

export default GlassBreakModal;
