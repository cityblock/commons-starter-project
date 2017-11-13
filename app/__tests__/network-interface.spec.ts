import createNetworkInterface from '../network-interface';

it('creates network interface', () => {
  const networkInterface = createNetworkInterface();
  expect(networkInterface._uri).toEqual('https://localhost:3000/graphql');
});
