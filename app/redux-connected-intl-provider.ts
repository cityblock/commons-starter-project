import { addLocaleData, IntlProvider } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { IState } from './store';

// NOTE: ReactIntlLocaleData is loaded in app.ts
// importing via `import es from 'react-intl/locale-data/es';` is broken in ReactIntl
if (window && (window as any).ReactIntlLocaleData) {
  addLocaleData((window as any).ReactIntlLocaleData.es);
}

export interface IProps {
  initialNow: number;
  locale: string;
  key: string;
  messages: any;
}

function mapStateToProps(state: IState): Partial<IProps> {
  const { lang, messages } = state.locale;
  const language = lang || 'en';
  return {
    initialNow: Date.now(),
    locale: language,
    key: language,
    messages,
  };
}

function mapDispatchToProps(dispatch: Dispatch<() => void>): Partial<IProps> {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(IntlProvider);
