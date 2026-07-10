import { fetchBookById, fetchBooks } from '@/services/books';

describe('book API', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns a paginated list of books', async () => {
    const expectation = expect(fetchBooks({ page: 1, limit: 5 })).resolves.toMatchObject({
      page: 1,
      hasMore: true,
      total: expect.any(Number),
    });

    await jest.advanceTimersByTimeAsync(650);
    await expectation;
  });

  it('returns a selected book by id', async () => {
    const expectation = expect(fetchBookById('alchemist')).resolves.toMatchObject({
      id: 'alchemist',
      title: 'The Alchemist',
    });

    await jest.advanceTimersByTimeAsync(650);
    await expectation;
  });

  it('supports simulated failures', async () => {
    const expectation = expect(fetchBooks({ shouldFail: true })).rejects.toThrow(
      'We could not load books right now.',
    );

    await jest.advanceTimersByTimeAsync(650);
    await expectation;
  });
});