import { shallow } from 'enzyme';
import React from 'react';
import { patient, quickCall } from '../../../shared/util/test-data';
import { QuickCallPopup as Component } from '../quick-call-popup';

const createQuickCall = jest.fn();
createQuickCall.mockReturnValue({
  data: quickCall,
});
const failedCreateQuickCall = jest.fn();
failedCreateQuickCall.mockReturnValue(null);
const close = jest.fn();
const exampleInternalQuickCallState = {
  reason: 'example reason',
  summary: 'example summary',
  callRecipient: 'example callRecipient',
  startTime: '2017-11-07T13:45:14.532Z',
  direction: 'Outbound',
  wasSuccessful: 'true',
  patientId: patient.id,
};

describe('shallow rendered', () => {
  let instance: any;

  describe('error handling', () => {
    beforeEach(() => {
      const component = shallow(
        <Component
          close={close}
          patient={patient}
          patientId={patient.id}
          visible={true}
          createQuickCall={failedCreateQuickCall}
        />,
      );
      instance = component.instance() as Component;
    });

    it('sets error all data is not set', async () => {
      instance.onChange({
        target: {
          name: 'reason',
          value: 'example reason',
        },
      });

      await instance.submit({
        preventDefault: jest.fn(),
      });
      await expect(instance.state.error).toEqual(
        'Summary, direction, recipient, was successful, start time are all required',
      );
    });
  });

  describe('change handling and submission', () => {
    beforeEach(() => {
      const component = shallow(
        <Component
          close={close}
          patient={patient}
          patientId={patient.id}
          visible={true}
          createQuickCall={createQuickCall}
        />,
      );
      instance = component.instance() as Component;

      instance.setState({
        quickCall: exampleInternalQuickCallState,
      });
    });

    it('handles changes', async () => {
      instance.onChange({
        target: {
          name: 'reason',
          value: 'my new reason',
        },
      });

      await instance.submit({
        preventDefault: jest.fn(),
      });
      expect(createQuickCall).toBeCalledWith({
        variables: {
          ...exampleInternalQuickCallState,
          reason: 'my new reason',
          wasSuccessful: true,
        },
      });
    });

    it('submit attempts to create quick call via mutation', async () => {
      await instance.submit({
        preventDefault: jest.fn(),
      });
      expect(createQuickCall).toBeCalledWith({
        variables: { ...exampleInternalQuickCallState, wasSuccessful: true },
      });
    });

    it('calls close on successful creation', async () => {
      await instance.submit({
        preventDefault: jest.fn(),
      });
      expect(close).toBeCalled();
    });
  });
});
