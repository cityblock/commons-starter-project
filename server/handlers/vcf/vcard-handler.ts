import * as express from 'express';
import * as vCard from 'vcards-js';
import { decodeJwt } from '../../graphql/shared/utils';

export const validateJwtForVcf = async (token: string | null): Promise<boolean> => {
  let decoded = null;

  if (token) {
    try {
      decoded = await decodeJwt(token);
    } catch (err) {
      console.warn(err);
    }
  }

  return !!decoded;
};

export const contactsVcfHandler = async (req: express.Request, res: express.Response) => {
  const { token } = req.query;
  const isValidToken = await validateJwtForVcf(token || null);

  if (!isValidToken) {
    return res.status(401).send('Invalid token');
  }
  // TODO: Add logic to load actual user's contacts
  const card = vCard();

  card.firstName = 'Sansa';
  card.lastName = 'Stark';
  card.cellPhone = '+17274222222';

  let result = card.getFormattedString();

  const card2 = vCard();

  card2.firstName = 'Daenerys';
  card2.lastName = 'Targaryen';
  card2.cellPhone = '+17274567890';
  card2.homePhone = '+17274445555';

  result += card2.getFormattedString();

  res.set('Content-Type', 'text/vcard; name="contacts.vcf"');
  res.set('Content-Disposition', 'attachment; filename="contacts.vcf"');

  res.send(result);
};
