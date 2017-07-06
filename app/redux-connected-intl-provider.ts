import { addLocaleData, IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { IState } from './store';

// NOTE: ReactIntlLocaleData is loaded in app.ts
// importing via `import es from 'react-intl/locale-data/es';` is broken in ReactIntl
if (window && (window as any).ReactIntlLocaleData) {
  addLocaleData((window as any).ReactIntlLocaleData.es);
}

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
