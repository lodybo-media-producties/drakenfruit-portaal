import { describe, test } from 'vitest';
import * as validationFlows from '~/validations/flows';

describe('Validating user flows', () => {
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
});
