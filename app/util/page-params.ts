import * as querystring from 'querystring';

export function getPageParams() {
  return querystring.parse(window.location.search.substring(1));
}
