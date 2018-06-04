import React from 'react';
import ReactGA from 'react-ga';

interface IProps {
  location: {
    pathname: string;
  };
}

const uuidRegex = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

ReactGA.initialize(process.env.GA_TRACKING_ID || 'UA-105679021-5', {
  debug: true,
});

export default function withTracker(WrappedComponent: React.ComponentClass<any>) {
  const trackPage = (page: string) => {
    const formattedPage = page.replace(uuidRegex, 'id');
    ReactGA.set({
      page: formattedPage,
    });
    ReactGA.pageview(formattedPage);
  };

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
