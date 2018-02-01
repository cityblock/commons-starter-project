import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../../library/form-label/form-label';
import Option from '../../../library/option/option';
import Select from '../../../library/select/select';
import { CBO, CBO2 } from '../../../util/test-data';
import { CreateTaskCBO } from '../cbo';
import CreateTaskCBODetail from '../cbo-detail';
import { OTHER_CBO } from '../create-task';
import CreateTaskOtherCBO from '../other-cbo';

describe('Create Task Modal CBO Component', () => {
  const placeholderFn = () => true as any;
  const categoryId = 'foodServices';

  const wrapper = shallow(
    <CreateTaskCBO
      CBOs={[CBO, CBO2]}
      categoryId={categoryId}
      CBOName=""
      CBOUrl=""
      CBOId=""
      onChange={placeholderFn}
    />,
  );

  it('renders label to select a CBO', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('taskCreate.CBO');
    expect(wrapper.find(FormLabel).props().gray).toBeFalsy();
    expect(wrapper.find(FormLabel).props().topPadding).toBeTruthy();
  });

  it('renders select tag to choose CBO', () => {
    expect(wrapper.find(Select).length).toBe(1);
    expect(wrapper.find(Select).props().value).toBeFalsy();
    expect(wrapper.find(Select).props().className).toBe('select');
  });

  it('renders placeholder option to select CBO', () => {
    expect(wrapper.find(Option).length).toBe(4);
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().messageId,
    ).toBe('taskCreate.selectCBO');
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().disabled,
    ).toBeTruthy();
  });

  it('renders options for each CBO', () => {
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().value,
    ).toBe(CBO.id);
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().label,
    ).toBe(CBO.name);

    expect(
      wrapper
        .find(Option)
        .at(2)
        .props().value,
    ).toBe(CBO2.id);
    expect(
      wrapper
        .find(Option)
        .at(2)
        .props().label,
    ).toBe(CBO2.name);
  });

  it('renders option to choose other CBO', () => {
    expect(
      wrapper
        .find(Option)
        .at(3)
        .props().messageId,
    ).toBe('taskCreate.otherCBO');
    expect(
      wrapper
        .find(Option)
        .at(3)
        .props().value,
    ).toBe(OTHER_CBO);
  });

  it('does not render additional fields if no CBO selected', () => {
    expect(wrapper.find(CreateTaskCBODetail).length).toBe(0);
    expect(wrapper.find(CreateTaskOtherCBO).length).toBe(0);
  });

  it('renders CBO detail if one selected', () => {
    wrapper.setProps({
      CBOName: '',
      CBOUrl: '',
      CBOId: CBO.id,
    });

    expect(wrapper.find(Select).props().value).toBe(CBO.id);
    expect(wrapper.find(FormLabel).props().gray).toBeTruthy();
    expect(wrapper.find(CreateTaskCBODetail).length).toBe(1);
    expect(wrapper.find(CreateTaskCBODetail).props().CBO).toEqual(CBO);
  });

  it('renders fields to input name and url if other CBO selected', () => {
    const CBOName = 'Arya Warm Pies';
    const CBOUrl = 'www.agirlistiredofwritingtests.com';

    wrapper.setProps({
      CBOName,
      CBOUrl,
      CBOId: OTHER_CBO,
    });

    expect(wrapper.find(CreateTaskOtherCBO).length).toBe(1);
    expect(wrapper.find(CreateTaskOtherCBO).props().CBOName).toBe(CBOName);
    expect(wrapper.find(CreateTaskOtherCBO).props().CBOUrl).toBe(CBOUrl);
  });

  it('renders loading indication if loading', () => {
    wrapper.setProps({ loading: true, CBOs: [] });

    expect(wrapper.find(Option).length).toBe(1);
    expect(wrapper.find(Option).props().messageId).toBe('select.loading');

    expect(wrapper.find(CreateTaskCBODetail).length).toBe(0);
    expect(wrapper.find(CreateTaskOtherCBO).length).toBe(0);
  });
});
