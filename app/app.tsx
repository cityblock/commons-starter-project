import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ReduxConnectedIntlProvider from './redux-connected-intl-provider';
import Routes from './routes';
import Modal from './shared/library/modal/modal';

interface IProps {
  client: any;
  store: any;
}

export default class App extends React.Component<IProps> {
  // This is a hack that overrides the default React Router Prompt component.
  // This will get opened anytime a <Prompt> component is triggered
  getUserConfirmation = (message: string, callback: (ok: boolean) => void) => {
    const modal = document.createElement('div');
    document.body.appendChild(modal);

    const cleanupModal = (shouldContinue: boolean) => {
      ReactDOM.unmountComponentAtNode(modal);
      document.body.removeChild(modal);
      callback(shouldContinue);
    };

    ReactDOM.render(
      <ApolloProvider client={this.props.client}>
        <Provider store={this.props.store}>
          <ReduxConnectedIntlProvider>
            <Modal
              titleText={message}
              subTitleMessageId="saveModal.subtitle"
              onClose={() => cleanupModal(false)}
              onSubmit={() => cleanupModal(true)}
              cancelMessageId="saveModal.cancel"
              submitMessageId="saveModal.continueWithoutSaving"
              isVisible={true}
              headerIconName="errorOutline"
              headerIconColor="red"
              redSubmitButton={true}
            />
          </ReduxConnectedIntlProvider>
        </Provider>
      </ApolloProvider>,
      modal,
    );
  };

  render() {
    return (
      <React.StrictMode>
        <ApolloProvider client={this.props.client}>
          <Provider store={this.props.store}>
            <ReduxConnectedIntlProvider>
              <BrowserRouter getUserConfirmation={this.getUserConfirmation}>{Routes}</BrowserRouter>
            </ReduxConnectedIntlProvider>
          </Provider>
        </ApolloProvider>
      </React.StrictMode>
    );
  }
}
