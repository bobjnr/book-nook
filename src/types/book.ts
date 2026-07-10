export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  rating: number;
  reviews: number;
  price: number;
  category: string;
};

export type CartItem = {
  book: Book;
  quantity: number;
};
