import createNetworkInterface from '../network-interface';

it('creates network interface', () => {
  const networkInterface = createNetworkInterface();
  expect(networkInterface.HTTPBatchedNetworkInterface).not.toBeNull();
});
