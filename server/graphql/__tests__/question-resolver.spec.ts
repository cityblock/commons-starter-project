import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import ProgressNoteTemplate from '../../models/progress-note-template';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import ScreeningTool from '../../models/screening-tool';
import User from '../../models/user';
import { createMockClinic, createMockUser, createRiskArea } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('question tests', () => {
  let db: Db;
  const userRole = 'admin';
  let question: Question;
  let answer: Answer;
  let user: User;
  let clinic: Clinic;
  let riskArea: RiskArea;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    riskArea = await createRiskArea({ title: 'Risk Area' });
    question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    });
    answer = await Answer.create({
      value: '3',
      valueType: 'number',
      displayValue: 'loves writing tests!',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve question', () => {
    it('can fetch question', async () => {
      const query = `{
        question(questionId: "${question.id}") {
          id, title
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.question)).toMatchObject({
        id: question.id,
        title: 'like writing tests?',
      });
    });

    it('errors if an question cannot be found', async () => {
      const fakeId = uuid();
      const query = `{ question(questionId: "${fakeId}") { id } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch(`No such question: ${fakeId}`);
    });
  });

  describe('question edit', () => {
    it('edits question', async () => {
      const query = `mutation {
        questionEdit(input: {
          title: "new title"
          answerType: multiselect
          order: 4,
          questionId: "${question.id}"
        }) {
          title, answerType, order
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.questionEdit)).toMatchObject({
        title: 'new title',
        answerType: 'multiselect',
        order: 4,
      });
    });
  });

  describe('resolveQuestions', () => {
    it('gets questions for risk area', async () => {
      const query = `{
        questions(filterType: riskArea, filterId: "${riskArea.id}") {
          title, answerType, order, answers { id }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.questions)).toMatchObject([
        {
          title: 'like writing tests?',
          answerType: 'dropdown',
          order: 1,
          answers: [{ id: answer.id }],
        },
      ]);
    });

    it('gets questions for screening tool', async () => {
      const screeningTool = await ScreeningTool.create({
        title: 'screening tool',
        riskAreaId: riskArea.id,
      });
      await Question.create({
        title: 'hate writing tests?',
        answerType: 'dropdown',
        screeningToolId: screeningTool.id,
        type: 'screeningTool',
        order: 1,
      });

      const query = `{
        questions(filterType: screeningTool, filterId: "${screeningTool.id}") {
          title, answerType, order, answers { id }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.questions)).toMatchObject([
        {
          title: 'hate writing tests?',
          answerType: 'dropdown',
          order: 1,
          answers: [],
        },
      ]);
    });

    it('gets questions for progress note template', async () => {
      const progressNoteTemplate = await ProgressNoteTemplate.create({ title: 'title' });
      await Question.create({
        title: 'hate writing tests?',
        answerType: 'dropdown',
        progressNoteTemplateId: progressNoteTemplate.id,
        type: 'progressNoteTemplate',
        order: 1,
      });

      const query = `{
        questions(filterType: progressNoteTemplate, filterId: "${progressNoteTemplate.id}") {
          title, answerType, order, answers { id }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.questions)).toMatchObject([
        {
          title: 'hate writing tests?',
          answerType: 'dropdown',
          order: 1,
          answers: [],
        },
      ]);
    });
  });

  describe('question create', () => {
    it('creates a new question', async () => {
      const mutation = `mutation {
        questionCreate(input: {
          title: "new title"
          answerType: radio
          validatedSource: "logan"
          riskAreaId: "${riskArea.id}"
          order: 2
        }) {
          title, answerType, validatedSource, riskAreaId, order
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.questionCreate)).toMatchObject({
        title: 'new title',
        answerType: 'radio',
        validatedSource: 'logan',
        riskAreaId: riskArea.id,
        order: 2,
      });
    });

    it('creates a new question for a screening tool', async () => {
      const screeningTool = await ScreeningTool.create({
        title: 'screening tool',
        riskAreaId: riskArea.id,
      });
      await Question.create({
        title: 'hate writing tests?',
        answerType: 'dropdown',
        screeningToolId: screeningTool.id,
        type: 'screeningTool',
        order: 1,
      });

      const mutation = `mutation {
        questionCreate(input: {
          title: "new title",
          answerType: radio,
          validatedSource: "brennan"
          screeningToolId: "${screeningTool.id}"
          order: 2
        }) {
          title, answerType, validatedSource, screeningToolId, order
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.questionCreate)).toMatchObject({
        title: 'new title',
        answerType: 'radio',
        validatedSource: 'brennan',
        screeningToolId: screeningTool.id,
        order: 2,
      });
    });

    it('creates a new question for a progress note template', async () => {
      const progressNoteTemplate = await ProgressNoteTemplate.create({ title: 'title' });

      await Question.create({
        title: 'hate writing tests?',
        answerType: 'dropdown',
        progressNoteTemplateId: progressNoteTemplate.id,
        type: 'progressNoteTemplate',
        order: 1,
      });

      const mutation = `mutation {
        questionCreate(input: {
          title: "new title",
          answerType: radio,
          validatedSource: "brennan"
          progressNoteTemplateId: "${progressNoteTemplate.id}"
          order: 2
        }) {
          title, answerType, validatedSource, progressNoteTemplateId, order
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.questionCreate)).toMatchObject({
        title: 'new title',
        answerType: 'radio',
        validatedSource: 'brennan',
        progressNoteTemplateId: progressNoteTemplate.id,
        order: 2,
      });
    });
  });

  describe('question delete', () => {
    it('marks an question as deleted', async () => {
      const mutation = `mutation {
        questionDelete(input: { questionId: "${question.id}" }) {
          id
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.questionDelete)).toMatchObject({
        id: question.id,
      });
    });
  });
});
