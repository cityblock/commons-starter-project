/* tslint:disable no-var-requires */
const graphQLDocs = require('../documents.json');
/* tslint:enable no-var-requires */

export function getQuery(fileName: string) {
  return graphQLDocs[fileName];
}
