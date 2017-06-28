import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { IState } from './store';

function mapStateToProps(state: IState) {
  const { lang, messages } = state.locale;
  const language = lang || 'en';
  return {
    initialNow: Date.now(),
    locale: language,
    key: language,
    messages,
  };
}
export default connect(mapStateToProps)(IntlProvider as any);
