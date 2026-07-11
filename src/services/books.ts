import type { Book } from '@/types/book';

type BookQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  shouldFail?: boolean;
};

const NETWORK_DELAY_MS = 650;

export const books: Book[] = [
  {
    id: 'alchemist',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    price: 10.99,
    rating: 4.7,
    reviews: 12650,
    cover: 'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg',
    description:
      'A magical fable about following your dream and listening to your heart as Santiago journeys from Spain to the Egyptian desert in search of treasure.',
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Non-Fiction',
    price: 14.99,
    rating: 4.8,
    reviews: 18420,
    cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    description:
      'A practical guide to building good habits, breaking bad ones, and designing systems that make small improvements compound into remarkable results.',
  },
  {
    id: 'midnight-library',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    category: 'Fiction',
    price: 12.99,
    rating: 4.6,
    reviews: 9380,
    cover: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg',
    description:
      'Between life and death, Nora Seed discovers a library of possible lives and learns what truly makes a life worth living.',
  },
  {
    id: 'book-thief',
    title: 'The Book Thief',
    author: 'Markus Zusak',
    category: 'Historical',
    price: 11.49,
    rating: 4.8,
    reviews: 15310,
    cover: 'https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg',
    description:
      'A moving story of a young girl in wartime Germany whose love of books becomes an act of courage and connection.',
  },
  {
    id: 'educated',
    title: 'Educated',
    author: 'Tara Westover',
    category: 'Memoir',
    price: 13.99,
    rating: 4.7,
    reviews: 11220,
    cover: 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg',
    description:
      'A memoir about self-invention, family loyalty, and the difficult path from an isolated childhood to formal education.',
  },
  {
    id: 'project-hail-mary',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    category: 'Sci-Fi',
    price: 16.99,
    rating: 4.9,
    reviews: 14560,
    cover: 'https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg',
    description:
      'A lone astronaut wakes with no memory and must solve an impossible scientific problem to save Earth.',
  },
  {
    id: 'circe',
    title: 'Circe',
    author: 'Madeline Miller',
    category: 'Fantasy',
    price: 12.49,
    rating: 4.6,
    reviews: 10450,
    cover: 'https://covers.openlibrary.org/b/isbn/9780316556347-L.jpg',
    description:
      'A lyrical retelling of the witch Circe, daughter of Helios, as she claims power and independence among gods and mortals.',
  },
  {
    id: 'where-crawdads-sing',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    category: 'Mystery',
    price: 9.99,
    rating: 4.5,
    reviews: 17410,
    cover: 'https://covers.openlibrary.org/b/isbn/9780735219090-L.jpg',
    description:
      'A coming-of-age mystery set in the marshes of North Carolina, where isolation, love, and suspicion collide.',
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Productivity',
    price: 13.49,
    rating: 4.5,
    reviews: 7820,
    cover: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg',
    description:
      'A focused argument for cultivating distraction-free concentration in a world designed to fragment attention.',
  },
  {
    id: 'dune',
    title: 'Dune',
    author: 'Frank Herbert',
    category: 'Sci-Fi',
    price: 15.49,
    rating: 4.7,
    reviews: 22190,
    cover: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
    description:
      'A sweeping epic of politics, ecology, religion, and destiny on the desert planet Arrakis.',
  },
  {
    id: 'sapiens',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'History',
    price: 17.99,
    rating: 4.6,
    reviews: 20340,
    cover: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
    description:
      'A bold history of humankind, tracing how biology, culture, stories, and cooperation shaped our world.',
  },
  {
    id: 'little-prince',
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupery',
    category: 'Classic',
    price: 8.99,
    rating: 4.8,
    reviews: 19120,
    cover: 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg',
    description:
      'A tender, philosophical tale of a prince who travels from planet to planet and reveals what grown-ups forget.',
  },
  {
    id: 'power-of-now',
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    category: 'Wellness',
    price: 11.99,
    rating: 4.4,
    reviews: 8630,
    cover: 'https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg',
    description:
      'A spiritual guide to presence, awareness, and living with less attachment to past and future worries.',
  },
  {
    id: 'normal-people',
    title: 'Normal People',
    author: 'Sally Rooney',
    category: 'Romance',
    price: 10.49,
    rating: 4.2,
    reviews: 7420,
    cover: 'https://covers.openlibrary.org/b/isbn/9781984822185-L.jpg',
    description:
      'A precise and intimate novel about class, friendship, love, and the shifting bond between two young people.',
  },
  {
    id: 'ikigai',
    title: 'Ikigai',
    author: 'Hector Garcia',
    category: 'Wellness',
    price: 12.49,
    rating: 4.4,
    reviews: 6750,
    cover: 'https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg',
    description:
      'A concise exploration of the Japanese concept of purpose and the habits that support a long, meaningful life.',
  },
  {
    id: 'hobbit',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    price: 9.49,
    rating: 4.8,
    reviews: 23670,
    cover: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
    description:
      'Bilbo Baggins leaves the comfort of home for a grand adventure with dwarves, dragons, riddles, and courage.',
  },
  {
    id: 'thinking-fast-slow',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Psychology',
    price: 15.99,
    rating: 4.5,
    reviews: 13280,
    cover: 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg',
    description:
      'A landmark tour of human judgment, bias, and the two systems that shape how we think and decide.',
  },
  {
    id: 'the-lean-startup',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    category: 'Business',
    price: 13.99,
    rating: 4.3,
    reviews: 7110,
    cover: 'https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg',
    description:
      'A startup playbook for validated learning, rapid experimentation, and building products customers actually need.',
  },
  {
    id: 'becoming',
    title: 'Becoming',
    author: 'Michelle Obama',
    category: 'Memoir',
    price: 16.49,
    rating: 4.8,
    reviews: 16540,
    cover: 'https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg',
    description:
      'An intimate memoir of identity, public life, family, and becoming one of the most recognizable women in the world.',
  },
  {
    id: 'silent-patient',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    category: 'Thriller',
    price: 10.99,
    rating: 4.3,
    reviews: 12110,
    cover: 'https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg',
    description:
      'A psychological thriller about a woman who stops speaking after a shocking crime and the therapist determined to uncover why.',
  },
  {
    id: 'start-with-why',
    title: 'Start with Why',
    author: 'Simon Sinek',
    category: 'Business',
    price: 12.99,
    rating: 4.4,
    reviews: 6930,
    cover: 'https://covers.openlibrary.org/b/isbn/9781591846444-L.jpg',
    description:
      'A leadership book about purpose, trust, and why inspiring organizations begin with a clear reason for existing.',
  },
  {
    id: 'seven-husbands',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    category: 'Fiction',
    price: 11.99,
    rating: 4.7,
    reviews: 14880,
    cover: 'https://covers.openlibrary.org/b/isbn/9781501161933-L.jpg',
    description:
      'A glamorous and emotional story of fame, ambition, secrets, and the complicated loves of a Hollywood icon.',
  },
  {
    id: 'zero-to-one',
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'Business',
    price: 14.49,
    rating: 4.2,
    reviews: 5920,
    cover: 'https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg',
    description:
      'A contrarian guide to startups, monopolies, and building companies that create new value instead of copying what exists.',
  },
  {
    id: 'song-of-achilles',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    category: 'Fantasy',
    price: 10.99,
    rating: 4.7,
    reviews: 13400,
    cover: 'https://covers.openlibrary.org/b/isbn/9780062060624-L.jpg',
    description:
      'A tender retelling of Achilles and Patroclus, blending myth, war, devotion, and tragedy.',
  },
];

function wait(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function maybeFail(shouldFail?: boolean) {
  if (shouldFail) {
    throw new Error('We could not load books right now. Please try again.');
  }
}

export async function fetchBooks({ page = 1, limit = 10, search = '', category, shouldFail }: BookQuery = {}) {
  await wait();
  maybeFail(shouldFail);

  const normalizedSearch = search.trim().toLowerCase();
  const normalizedCategory = category?.trim().toLowerCase();
  const categoryBooks = normalizedCategory
    ? books.filter((book) => book.category.toLowerCase() === normalizedCategory)
    : books;
  const filteredBooks = normalizedSearch
    ? categoryBooks.filter((book) =>
        [book.title, book.author, book.category].some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        ),
      )
    : categoryBooks;

  const start = (page - 1) * limit;
  const paginatedBooks = filteredBooks.slice(start, start + limit);

  return {
    data: paginatedBooks,
    page,
    hasMore: start + limit < filteredBooks.length,
    total: filteredBooks.length,
  };
}

export async function fetchBookById(id: string, options?: { shouldFail?: boolean }) {
  await wait();
  maybeFail(options?.shouldFail);

  const book = books.find((item) => item.id === id);

  if (!book) {
    throw new Error('Book not found.');
  }

  return book;
}


