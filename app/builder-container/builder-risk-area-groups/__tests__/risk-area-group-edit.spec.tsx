import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import EditableMultilineText from '../../../shared/library/editable-multiline-text/editable-multiline-text';
import { riskAreaGroup } from '../../../shared/util/test-data';
import { RiskAreaGroupEdit } from '../risk-area-group-edit';

describe('Builder Risk Area Group Edit Component', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <RiskAreaGroupEdit
      close={placeholderFn}
      deleteRiskAreaGroup={placeholderFn}
      editRiskAreaGroup={placeholderFn}
      riskAreaGroup={riskAreaGroup}
    />,
  );

  it('renders button to close risk area group', () => {
    expect(wrapper.find(Button).length).toBe(2);
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().messageId,
    ).toBe('riskAreaGroup.close');
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().icon,
    ).toBe('close');
    expect(
      wrapper
        .find(Button)
        .at(0)
        .props().color,
    ).toBe('white');
  });

  it('renders button to delete risk area group', () => {
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().messageId,
    ).toBe('riskAreaGroup.delete');
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().icon,
    ).toBe('delete');
    expect(
      wrapper
        .find(Button)
        .at(1)
        .props().color,
    ).toBe('white');
  });

  it('renders labels for fields', () => {
    expect(wrapper.find('h4').length).toBe(5);
  });

  it('renders editable text field for title', () => {
    expect(wrapper.find(EditableMultilineText).length).toBe(5);
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(0)
        .props().text,
    ).toBe(riskAreaGroup.title);
  });

  it('renders editable text field for short title', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(1)
        .props().text,
    ).toBe(riskAreaGroup.shortTitle);
  });

  it('renders editable text field for order', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(2)
        .props().text,
    ).toBe(`${riskAreaGroup.order}`);
  });

  it('renders editable text field for medium risk threshold', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(3)
        .props().text,
    ).toBe(`${riskAreaGroup.mediumRiskThreshold}`);
  });

  it('renders editable text field for high risk threshold', () => {
    expect(
      wrapper
        .find(EditableMultilineText)
        .at(4)
        .props().text,
    ).toBe(`${riskAreaGroup.highRiskThreshold}`);
  });
});
