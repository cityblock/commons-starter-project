import { shallow } from 'enzyme';

import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { riskArea } from '../../shared/util/test-data';
import RiskArea, { RiskArea as Component } from '../risk-area';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const match = {
  params: {
    riskAreaId: riskArea.id,
  },
};

it('renders risk area', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale, riskArea })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <RiskArea routeBase={'/route/base'} match={match} />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('shallow rendered', () => {
  const refetchRiskArea = jest.fn();
  const editRiskArea = jest.fn();
  const onDelete = jest.fn();
  let instance: any;
  beforeEach(() => {
    const component = shallow(
      <Component
        match={match}
        routeBase={'/route/base'}
        riskArea={riskArea}
        riskAreaId={riskArea.id}
        riskAreaLoading={false}
        riskAreaError={null}
        onDelete={onDelete}
        refetchRiskArea={refetchRiskArea}
        editRiskArea={editRiskArea}
      />,
    );
    instance = component.instance() as Component;
  });

  it('renders with screening tool', () => {
    expect(instance.render()).toMatchSnapshot();
  });

  it('confirms delete', async () => {
    await instance.onClickDelete();
    expect(instance.state.deleteConfirmationInProgress).toBeTruthy();

    await instance.onConfirmDelete();
    expect(onDelete).toBeCalledWith(riskArea.id);
    expect(instance.state.deleteConfirmationInProgress).toBeFalsy();
  });

  it('cancels delete', async () => {
    await instance.onClickDelete();
    expect(instance.state.deleteConfirmationInProgress).toBeTruthy();

    await instance.onCancelDelete();
    expect(instance.state.deleteConfirmationInProgress).toBeFalsy();
  });
});
