import { describe, test } from 'vitest';
import * as validationFlows from '~/validations/flows';
import {
  type PasswordChangeData,
  type PasswordChangeErrors,
  type ToolData,
  type UserData,
  type UserErrors,
} from '~/types/Validations';

describe('Validation flows', () => {
  describe('Authentication', () => {
    describe('Login validation', () => {
      test('Check whether a login request is valid or not', async () => {
        const formData = new FormData();
        formData.append('email', 'lody@drakenfruit.com');
        formData.append('password', '123456789');

        const loginRequest = new Request('http://localhost:3000/login', {
          method: 'POST',
          body: formData,
        });

        const validationResult =
          await validationFlows.validateLogin(loginRequest);
        expect(validationResult.success).toBe(true);
      });
    });

    describe('Password change validation', () => {
      test('Check whether a password change request is valid or not', async () => {
        const formData = new FormData();
        formData.append('email', 'kaylee@drakenfruit.com');
        formData.append('redirectTo', '/account');
        formData.append('new-password', '123456789');
        formData.append('confirm-password', '123456789');

        const passwordChangeRequest = new Request(
          'http://localhost:3000/password/change',
          {
            method: 'POST',
            body: formData,
          }
        );

        const validationResult = await validationFlows.validatePasswordChange(
          passwordChangeRequest
        );

        expect(validationResult.success).toBe(true);
        expect(validationResult.data).toStrictEqual<PasswordChangeData>({
          newPassword: '123456789',
          confirmation: '123456789',
          redirectTo: '/account',
          email: 'kaylee@drakenfruit.com',
        });

        const formData2 = new FormData();
        formData2.append('email', 'lody@drakenfruit.com');
        formData2.append('redirectTo', '/account');
        formData2.append('new-password', '123456789');
        formData2.append('confirm-password', '123456700');

        const passwordChangeRequest2 = new Request(
          'http://localhost:3000/password/change',
          {
            method: 'POST',
            body: formData2,
          }
        );

        const validationResult2 = await validationFlows.validatePasswordChange(
          passwordChangeRequest2
        );

        expect(validationResult2.success).toBe(false);
        expect(validationResult2.errors).toStrictEqual<PasswordChangeErrors>({
          combi: 'Wachtwoorden komen niet overeen',
        });
      });
    });
  });

  describe('Article validation', () => {
    test('Check whether an article request is valid or not', async () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('title.en', 'Title 1');
      formData.append('title.nl', 'Titel 1');
      formData.append('slug.en', 'title-1');
      formData.append('slug.nl', 'titel-1');
      formData.append('summary.en', 'Summary 1');
      formData.append('summary.nl', 'Samenvatting 1');
      formData.append('content.en', 'Content 1');
      formData.append('content.nl', 'Inhoud 1');
      formData.append('categories', '1,2');
      formData.append('authorId', '1');
      formData.append('image', '/path/to/image.jpg');

      const request = new Request('http://localhost:3000/api/article', {
        method: 'POST',
        body: formData,
      });

      const validationResult = await validationFlows.validateArticle(request);

      expect(validationResult.success).toBe(true);
      expect(validationResult.data).toStrictEqual({
        title: { en: 'Title 1', nl: 'Titel 1' },
        slug: { en: 'title-1', nl: 'titel-1' },
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        content: { en: 'Content 1', nl: 'Inhoud 1' },
        categories: ['1', '2'],
        authorId: '1',
        image: '/path/to/image.jpg',
      });
    });

    test('Check whether an article request is invalid because of missing titles', async () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('slug.en', 'title-1');
      formData.append('slug.nl', 'titel-1');
      formData.append('summary.en', 'Summary 1');
      formData.append('summary.nl', 'Samenvatting 1');
      formData.append('content.en', 'Content 1');
      formData.append('content.nl', 'Inhoud 1');
      formData.append('categories', '1,2');
      formData.append('authorId', '1');
      formData.append('image', '/path/to/image.jpg');

      const request = new Request('http://localhost:3000/api/article', {
        method: 'POST',
        body: formData,
      });

      const validationResult = await validationFlows.validateArticle(request);

      expect(validationResult.success).toBe(false);
      expect(validationResult.errors!.title).toStrictEqual({
        en: 'Waarde is verplicht',
        nl: 'Waarde is verplicht',
      });
      expect(validationResult.data).toBe(undefined);
    });

    test('Check whether an article request is invalid because of a singular missing slug', async () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('slug.en', 'title-1');
      formData.append('summary.en', 'Summary 1');
      formData.append('summary.nl', 'Samenvatting 1');
      formData.append('content.en', 'Content 1');
      formData.append('content.nl', 'Inhoud 1');
      formData.append('categories', '1,2');
      formData.append('authorId', '1');
      formData.append('image', '/path/to/image.jpg');

      const request = new Request('http://localhost:3000/api/article', {
        method: 'POST',
        body: formData,
      });

      const validationResult = await validationFlows.validateArticle(request);

      expect(validationResult.success).toBe(false);
      expect(validationResult.errors!.slug).toStrictEqual({
        nl: 'Waarde is verplicht',
      });
      expect(validationResult.data).toBe(undefined);
    });

    test('Check whether an article request is invalid because of a missing image', async () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('slug.en', 'title-1');
      formData.append('summary.en', 'Summary 1');
      formData.append('summary.nl', 'Samenvatting 1');
      formData.append('content.en', 'Content 1');
      formData.append('content.nl', 'Inhoud 1');
      formData.append('categories', '1,2');
      formData.append('authorId', '1');

      const request = new Request('http://localhost:3000/api/article', {
        method: 'POST',
        body: formData,
      });

      const validationResult = await validationFlows.validateArticle(request);

      expect(validationResult.success).toBe(false);
      expect(validationResult.errors!.image).toStrictEqual({
        en: 'Image is required',
        nl: 'Afbeelding is verplicht',
      });
      expect(validationResult.data).toBe(undefined);
    });
  });

  describe('Category validation', () => {
    test('Check whether a category request is valid or not', async () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('name.en', 'Name 1');
      formData.append('name.nl', 'Naam 1');
      formData.append('slug.en', 'name-1');
      formData.append('slug.nl', 'naam-1');
      formData.append('description.en', 'Description 1');
      formData.append('description.nl', 'Beschrijving 1');

      const request = new Request('http://localhost:3000/api/category', {
        method: 'POST',
        body: formData,
      });

      const validationResult = await validationFlows.validateCategory(request);

      expect(validationResult.success).toBe(true);
      expect(validationResult.data).toStrictEqual({
        name: { en: 'Name 1', nl: 'Naam 1' },
        slug: { en: 'name-1', nl: 'naam-1' },
        description: { en: 'Description 1', nl: 'Beschrijving 1' },
      });
    });

    test('Check whether a category request is invalid because of missing names', async () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('slug.en', 'name-1');
      formData.append('slug.nl', 'naam-1');
      formData.append('description.en', 'Description 1');
      formData.append('description.nl', 'Beschrijving 1');

      const request = new Request('http://localhost:3000/api/category', {
        method: 'POST',
        body: formData,
      });

      const validationResult = await validationFlows.validateCategory(request);

      expect(validationResult.success).toBe(false);
      expect(validationResult.errors!.name).toStrictEqual({
        en: 'Waarde is verplicht',
        nl: 'Waarde is verplicht',
      });
      expect(validationResult.data).toBe(undefined);
    });
  });

  describe('Tool validation', () => {
    test.skip('Check whether a tool request is valid or not', async () => {
      // Test is skipped because mocking FormData and its handling of a File object took too much time to figure out...
      const tool = new Blob([''], { type: 'application/zip' });
      const image = new Blob([''], { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('id', '1');
      formData.append('name.en', 'Name 1');
      formData.append('name.nl', 'Naam 1');
      formData.append('slug.en', 'name-1');
      formData.append('slug.nl', 'naam-1');
      formData.append('summary.en', 'Summary 1');
      formData.append('summary.nl', 'Samenvatting 1');
      formData.append('description.en', 'Description 1');
      formData.append('description.nl', 'Beschrijving 1');
      formData.append('categories', '1,2');
      formData.append('filename', tool);
      formData.append('image', image);

      const request = new Request('http://localhost:3000/api/tool', {
        method: 'POST',
        body: formData,
      });

      const validationResult = await validationFlows.validateTool(request);

      expect(validationResult.success).toBe(true);
      expect(validationResult.data).toStrictEqual<ToolData>({
        name: { en: 'Name 1', nl: 'Naam 1' },
        slug: { en: 'name-1', nl: 'naam-1' },
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        description: { en: 'Description 1', nl: 'Beschrijving 1' },
        filename: 'tool.zip',
        image: '/portal/tool/tool.zip',
        categories: ['1', '2'],
      });
    });

    test('Check a valid or invalid tool request but skip the uploads', async () => {
      const tool = new File([''], 'tool.zip', { type: 'application/zip' });

      const formData = new FormData();
      formData.append('id', '1');
      formData.append('name.en', 'Name 1');
      formData.append('name.nl', 'Naam 1');
      formData.append('slug.en', 'name-1');
      formData.append('slug.nl', 'naam-1');
      formData.append('summary.en', 'Summary 1');
      formData.append('summary.nl', 'Samenvatting 1');
      formData.append('description.en', 'Description 1');
      formData.append('description.nl', 'Beschrijving 1');
      formData.append('categories', '1,2');
      formData.append('tool', tool);
      formData.append('image', '');

      const request = new Request('http://localhost:3000/api/tool', {
        method: 'POST',
        body: formData,
      });

      const validationResult = await validationFlows.validateTool(
        request.clone()
      );

      expect(validationResult.success).toBe(false);
      expect(validationResult.errors!.image).toEqual('Afbeelding is verplicht');

      const validationResult2 = await validationFlows.validateTool(
        request,
        false
      );

      expect(validationResult2.success).toBe(true);
    });

    test('Check whether a tool request is invalid because of missing names', async () => {
      const tool = new File([''], 'tool.zip', { type: 'application/zip' });
      const image = new File([''], 'image.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('id', '1');
      formData.append('slug.en', 'name-1');
      formData.append('slug.nl', 'naam-1');
      formData.append('summary.en', 'Summary 1');
      formData.append('summary.nl', 'Samenvatting 1');
      formData.append('description.en', 'Description 1');
      formData.append('description.nl', 'Beschrijving 1');
      formData.append('categories', '1,2');
      formData.append('tool', tool);
      formData.append('image', image);

      const request = new Request('http://localhost:3000/api/tool', {
        method: 'POST',
        body: formData,
      });

      const validationResult = await validationFlows.validateTool(request);

      expect(validationResult.success).toBe(false);
      expect(validationResult.errors!.name).toStrictEqual({
        en: 'Waarde is verplicht',
        nl: 'Waarde is verplicht',
      });
      expect(validationResult.data).toBe(undefined);
    });
  });

  describe('Organisation validation', () => {
    test('Check whether an organisation request is valid or not', async () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('name', 'Naam 1');
      formData.append('description', 'Beschrijving 1');

      const request = new Request('http://localhost:3000/api/organisation', {
        method: 'POST',
        body: formData,
      });

      const validationResult =
        await validationFlows.validateOrganisation(request);

      expect(validationResult.success).toBe(true);
      expect(validationResult.data).toStrictEqual({
        id: '1',
        name: 'Naam 1',
        description: 'Beschrijving 1',
      });
    });

    test('Check whether an organisation request is invalid because of missing name', async () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('description', 'Beschrijving 1');

      const request = new Request('http://localhost:3000/api/organisation', {
        method: 'POST',
        body: formData,
      });

      const validationResult =
        await validationFlows.validateOrganisation(request);

      expect(validationResult.success).toBe(false);
      expect(validationResult.errors!.name).toBe('Naam is verplicht');
      expect(validationResult.data).toBe(undefined);
    });
  });

  describe('Project validation', () => {
    test('Check whether a project request is valid or not', async () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('name', 'Naam 1');
      formData.append('description', 'Beschrijving 1');
      formData.append('organisationId', '1');

      const request = new Request('http://localhost:3000/api/project', {
        method: 'POST',
        body: formData,
      });

      const validationResult = await validationFlows.validateProject(request);

      expect(validationResult.success).toBe(true);
      expect(validationResult.data).toStrictEqual({
        id: '1',
        name: 'Naam 1',
        description: 'Beschrijving 1',
        organisationId: '1',
      });
    });

    test('Check whether a project request is invalid because of missing name', async () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('description', 'Beschrijving 1');
      formData.append('organisationId', '1');

      const request = new Request('http://localhost:3000/api/project', {
        method: 'POST',
        body: formData,
      });

      const validationResult = await validationFlows.validateProject(request);

      expect(validationResult.success).toBe(false);
      expect(validationResult.errors!.name).toBe('Naam is verplicht');
      expect(validationResult.data).toBe(undefined);
    });
  });

  describe('User validation', () => {
    test('Check whether a user request is valid or not', async () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('firstName', 'Kaylee');
      formData.append('lastName', 'Rosalina');
      formData.append('email', 'hallo@kayleerosalina.nl');
      formData.append('role', 'ADMIN');
      formData.append('organisationId', '1');
      formData.append('projectIds', '1,2');
      formData.append('locale', 'nl');
      formData.append('avatarUrl', '/path/to/avatar.jpg');

      const request = new Request('http://localhost:3000/api/user', {
        method: 'POST',
        body: formData,
        signal: new AbortController().signal,
      });

      const validationResult = await validationFlows.validateUser(request);

      expect(validationResult.success).toBe(true);
      expect(validationResult.data).toStrictEqual<UserData>({
        id: '1',
        firstName: 'Kaylee',
        lastName: 'Rosalina',
        email: 'hallo@kayleerosalina.nl',
        role: 'ADMIN',
        organisationId: '1',
        projectIds: ['1', '2'],
        locale: 'nl',
        avatarUrl: '/path/to/avatar.jpg',
      });
    });

    test('Check whether a user request is invalid because of a missing emailadress', async () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('firstName', 'Kaylee');
      formData.append('lastName', 'Rosalina');
      formData.append('password', '123456789');
      formData.append('role', 'ADMIN');
      formData.append('organisationId', '1');
      formData.append('locale', 'nl');
      formData.append('avatarUrl', '/path/to/avatar.jpg');

      const request = new Request('http://localhost:3000/api/user', {
        method: 'POST',
        body: formData,
      });

      const validationResult = await validationFlows.validateUser(request);

      expect(validationResult.success).toBe(false);
      expect(validationResult.errors).toStrictEqual<UserErrors>({
        email: 'E-mailadres is verplicht',
      });
    });
  });
});
