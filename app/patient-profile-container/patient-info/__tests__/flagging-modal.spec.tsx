import { shallow } from 'enzyme';
import React from 'react';
import { patientDataFlagCreate, DataFlagOptions } from '../../../graphql/types';
import FormLabel from '../../../shared/library/form-label/form-label';
import ModalButtons from '../../../shared/library/modal-buttons/modal-buttons';
import ModalError from '../../../shared/library/modal-error/modal-error';
import ModalHeader from '../../../shared/library/modal-header/modal-header';
import Select from '../../../shared/library/select/select';
import TextInput from '../../../shared/library/text-input/text-input';
import { Popup } from '../../../shared/popup/popup';
import { FlaggingModal } from '../flagging-modal';

describe('Render Flaggable Display Card Component', () => {
  const closePopup = () => true;
  const onSaved = (flag: patientDataFlagCreate['patientDataFlagCreate']) => true;
  const patientId = 'patient-id';
  const createFlag = jest.fn();
  const flagOptions: DataFlagOptions[] = [DataFlagOptions.firstName, DataFlagOptions.lastName];

  const wrapper = shallow(
    <FlaggingModal
      closePopup={closePopup}
      onSaved={onSaved}
      isVisible={false}
      patientId={patientId}
      createFlag={createFlag}
      flagOptions={flagOptions}
      prefix="coreIdentity"
    />,
  );

  it('renders a non visible popup', () => {
    const popup = wrapper.find(Popup);
    expect(popup).toHaveLength(1);
    expect(popup.props().visible).toBeFalsy();
    expect(popup.props().style).toBe('no-padding');
  });

  it('renders a visible popup', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(Popup).props().visible).toBeTruthy();
  });

  it('renders modal header', () => {
    const header = wrapper.find(ModalHeader);
    expect(header).toHaveLength(1);
    expect(header.props().titleMessageId).toBe('flaggingModal.title');
    expect(header.props().bodyMessageId).toBe('flaggingModal.description');
  });

  it('renders error band when there is an error', () => {
    expect(wrapper.find(ModalError)).toHaveLength(0);

    const saveError = 'this failed!';
    wrapper.setState({ saveError });
    const header = wrapper.find(ModalError);
    expect(header).toHaveLength(1);
    expect(header.props().error).toBe(saveError);
  });

  it('renders the empty form for field name flagging', () => {
    const labels = wrapper.find(FormLabel);
    expect(labels).toHaveLength(3);
    expect(labels.at(0).props().messageId).toBe('flaggingModal.fieldName');
    expect(labels.at(1).props().messageId).toBe('flaggingModal.correctValue');
    expect(labels.at(2).props().messageId).toBe('flaggingModal.notes');

    const select = wrapper.find(Select);
    expect(select).toHaveLength(1);
    expect(select.props().name).toBe('fieldName');
    expect(select.props().prefix).toBe('coreIdentity');
    expect(select.props().hasPlaceholder).toBeTruthy();
    expect(select.props().options).toMatchObject(flagOptions);
    expect(select.props().value).toBeFalsy();
    expect(select.props().large).toBe(true);

    const inputs = wrapper.find(TextInput);
    expect(inputs).toHaveLength(2);

    expect(inputs.at(0).props().name).toBe('suggestedValue');
    expect(inputs.at(0).props().value).toBeFalsy();

    expect(inputs.at(1).props().name).toBe('notes');
    expect(inputs.at(1).props().value).toBeFalsy();
    expect(inputs.at(1).props().placeholderMessageId).toBe('flaggingModal.notesPlaceholder');
  });

  it('renders a the form with state values', () => {
    const fieldName = 'firstName';
    const suggestedValue = 'Cristina';
    const notes = 'This is messed up!';

    wrapper.setState({ fieldName, suggestedValue, notes });

    expect(wrapper.find(Select).props().value).toBe(fieldName);

    const inputs = wrapper.find(TextInput);
    expect(inputs.at(0).props().value).toBe(suggestedValue);
    expect(inputs.at(1).props().value).toBe(notes);
  });

  it('renders modal buttons', () => {
    const buttons = wrapper.find(ModalButtons);
    expect(buttons).toHaveLength(1);
    expect(buttons.props().cancelMessageId).toBe('flaggingModal.cancel');
    expect(buttons.props().submitMessageId).toBe('flaggingModal.submit');
  });
});
