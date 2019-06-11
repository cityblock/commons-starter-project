import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import getPokemon from '../../app/graphql/queries/get-pokemon.graphql';
import { setupDb } from '../../lib/test-utils';
import schema from '../make-executable-schema';

// async function setup(txn: Transaction): Promise<ISetup> {
//   const clinic = await Clinic.create(createMockClinic(), txn);
//   const market = await Market.findOrCreateNycMarket(txn);
//   const user = await User.create(createMockUser(11, clinic.id, market.id, userRole), txn);
//   return { user };
// }

describe('pokemon resolver', () => {
  const getPokemonQuery = print(getPokemon);

  // some more:
  // const getPokemonsQuery = print(getPokemons);
  // const pokemonCreateMutation = print(pokemonCreate);
  // const pokemonDeleteMutation = print(pokemonDelete);
  // const pokemonEditMutation = print(pokemonEdit);

  // const getItemQuery = print(getItem);
  // const itemCreateMutation = print(itemCreate);
  // const itemDeleteMutation = print(itemDelete);
  // const itemEditMutation = print(itemEdit);

  let testDb = null as any;
  let txn = null as any;

  beforeAll(async () => {
    testDb = setupDb();
  });

  afterAll(async () => {
    testDb.destroy();
  });

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve a pokemon', () => {
    it('fetches a pokemon', async () => {
      const result = await graphql(
        schema,
        getPokemonQuery,
        null,
        { testTransaction: txn },
        {
          pokemonId: pokemon.id,
        },
      );
      expect(cloneDeep(result.data!.concern)).toMatchObject(concernInput);
    });
  });

  describe('concern create', () => {
    it('creates a concern', async () => {
      const { user } = await setup(txn);
      const result = await graphql(
        schema,
        concernCreateMutation,
        null,
        { permissions, userId: user.id, marketId: user.homeMarketId, testTransaction: txn },
        concernInput,
      );
      expect(cloneDeep(result.data!.concernCreate)).toMatchObject(concernInput);
    });
  });

  describe('concern edit', () => {
    let user = null as any;
    let concern = null as any;
    beforeEach(async () => {
      const testSetup = await setup(txn);
      user = testSetup.user;
      concern = await Concern.create({ title: 'housing' }, txn);
    });
    it('edits a concern title', async () => {
      const { data } = await graphql(
        schema,
        concernEditMutation,
        null,
        { permissions, userId: user.id, marketId: user.homeMarketId, testTransaction: txn },
        {
          title: 'Medical',
          concernId: concern.id,
        },
      );
      expect(cloneDeep(data.concernEdit)).toMatchObject({
        title: 'Medical',
      });
    });
    it('edits a concern by adding a resource url', async () => {
      const { data } = await graphql(
        schema,
        concernEditMutation,
        null,
        { permissions, userId: user.id, marketId: user.homeMarketId, testTransaction: txn },
        {
          title: 'Medical',
          concernId: concern.id,
          resourceUrl: mockResourceUrl,
        },
      );
      expect(cloneDeep(data.concernEdit)).toMatchObject({
        title: 'Medical',
        resourceUrl: mockResourceUrl,
      });
    });
    it('edits a concern by removing a resource url', async () => {
      const { data } = await graphql(
        schema,
        concernEditMutation,
        null,
        { permissions, userId: user.id, marketId: user.homeMarketId, testTransaction: txn },
        {
          concernId: concern.id,
          title: 'Medical',
          resourceUrl: null,
        },
      );
      expect(data.concernEdit.resourceUrl).toBeNull();
    });
  });

  describe('concern delete', () => {
    it('deletes a concern', async () => {
      const { user } = await setup(txn);
      const concern = await Concern.create({ title: 'housing' }, txn);
      const result = await graphql(
        schema,
        concernDeleteMutation,
        null,
        { permissions, userId: user.id, marketId: user.homeMarketId, testTransaction: txn },
        {
          concernId: concern.id,
        },
      );
      expect(cloneDeep(result.data!.concernDelete).deletedAt).not.toBeFalsy();
    });
  });

  describe('concerns', () => {
    it('returns concerns', async () => {
      const { user } = await setup(txn);
      const concern1 = await Concern.create({ title: 'housing' }, txn);
      const concern2 = await Concern.create({ title: 'medical' }, txn);

      const result = await graphql(schema, getConcernsQuery, null, {
        permissions,
        userId: user.id,
        marketId: user.homeMarketId,
        testTransaction: txn,
      });
      const concernTitles = cloneDeep(result.data!.concerns).map((c: Concern) => c.title);
      expect(concernTitles).toContain(concern2.title);
      expect(concernTitles).toContain(concern1.title);
    });

    it('returns concerns in a custom order', async () => {
      const { user } = await setup(txn);
      const concern1 = await Concern.create({ title: 'abc' }, txn);
      const concern2 = await Concern.create({ title: 'def' }, txn);

      const result = await graphql(
        schema,
        getConcernsQuery,
        null,
        {
          userId: user.id,
          marketId: user.homeMarketId,
          permissions,
          testTransaction: txn,
        },
        {
          orderBy: 'titleAsc',
        },
      );
      expect(cloneDeep(result.data!.concerns)).toMatchObject([
        {
          title: concern1.title,
        },
        {
          title: concern2.title,
        },
      ]);
    });
  });

  describe('concern add diagnosis code', () => {
    it('adds a diagnosis code to a concern', async () => {
      const { user } = await setup(txn);
      await DiagnosisCode.create(
        {
          codesetName: 'ICD-10',
          code: 'A00',
          label: 'Cholera',
          version: '2018',
        },
        txn,
      );
      const concern = await Concern.create({ title: 'Housing' }, txn);
      expect(concern.diagnosisCodes.length).toEqual(0);

      const result = await graphql(
        schema,
        concernAddDiagnosisCodeMutation,
        null,
        { userId: user.id, marketId: user.homeMarketId, permissions, testTransaction: txn },
        {
          codesetName: 'ICD-10',
          code: 'A00',
          version: '2018',
          concernId: concern.id,
        },
      );
      expect(cloneDeep(result.data!.concernAddDiagnosisCode)).toMatchObject({
        title: concern.title,
        diagnosisCodes: [
          {
            codesetName: 'ICD-10',
            code: 'A00',
            label: 'Cholera',
            version: '2018',
          },
        ],
      });
    });
  });

  describe('concern remove diagnosis code', () => {
    it('removes a diagnosis code from a concern', async () => {
      const { user } = await setup(txn);
      const diagnosisCode = await DiagnosisCode.create(
        {
          codesetName: 'ICD-10',
          code: 'A00',
          label: 'Cholera',
          version: '2018',
        },
        txn,
      );
      const concern = await Concern.create({ title: 'Housing' }, txn);
      await Concern.addDiagnosisCode(
        concern.id,
        {
          codesetName: 'ICD-10',
          code: 'A00',
          version: '2018',
        },
        txn,
      );
      const refetchedConcern = await Concern.get(concern.id, txn);
      expect(refetchedConcern.diagnosisCodes.length).toEqual(1);

      const result = await graphql(
        schema,
        concernRemoveDiagnosisCodeMutation,
        null,
        { userId: user.id, marketId: user.homeMarketId, permissions, testTransaction: txn },
        {
          concernId: concern.id,
          diagnosisCodeId: diagnosisCode.id,
        },
      );
      expect(cloneDeep(result.data!.concernRemoveDiagnosisCode)).toMatchObject({
        title: concern.title,
        diagnosisCodes: [],
      });
    });
  });
});
