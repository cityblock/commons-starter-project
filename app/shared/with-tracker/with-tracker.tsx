import { debounce, last } from 'lodash';
import React from 'react';
import ReactGA from 'react-ga';

interface IProps {
  location: {
    pathname: string;
  };
}

interface IEntries {
  getEntries: () => IEntry[];
}

interface IEntry {
  duration: number;
  entryType: string;
  name: string;
  startTime: number;
  initiatorType: string;
}

const uuidRegex = new RegExp(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g);

ReactGA.initialize(process.env.GA_TRACKING_ID || 'UA-105679021-5', {
  gaOptions: { siteSpeedSampleRate: 100 },
});

let startedAt = 0;
let currentUrl: null | string = null;

const trackPageLoad = (list: IEntries) => {
  if (currentUrl) {
    const entry = last(list.getEntries());
    if (entry) {
      const doneAt = entry.startTime + entry.duration;
      ReactGA.timing({
        category: 'page',
        variable: 'load',
        value: Math.round(doneAt - startedAt),
        label: currentUrl,
      });
      // return to null so we don't double track
      currentUrl = null;
    }
  }
};

/**
 * Performance tracking using the new-ish performance APIs.
 *
 * Heavily debounces tracking to ensure all requests have completed before we recored load
 */
const observer = new (window as any).PerformanceObserver(debounce(trackPageLoad, 5000));
observer.observe({ entryTypes: ['resource'] });

const trackPage = (page: string) => {
  startedAt = performance.now();

  const formattedPage = page.replace(uuidRegex, 'id');
  ReactGA.set({
    page: formattedPage,
  });
  ReactGA.pageview(formattedPage);

  currentUrl = formattedPage;
};

export default function withTracker(WrappedComponent: React.ComponentClass<any>) {
  const HOC = class extends React.Component<IProps> {
    componentDidMount() {
      trackPage(this.props.location.pathname);
    }

    componentWillReceiveProps(nextProps: IProps) {
      const currentPage = this.props.location.pathname;
      const nextPage = nextProps.location.pathname;

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
}
