-- ============================================================
-- BookHaven - Sample Books Seed Data
-- Run AFTER schema.sql: mysql -u root -p bookhaven < seed.sql
-- ============================================================

USE bookhaven;

-- Clear existing data (safe re-seed)
DELETE FROM feedback;
DELETE FROM purchases;
DELETE FROM books;
ALTER TABLE books AUTO_INCREMENT = 1;

-- ─────────────────────────────────────────
-- FREE BOOKS (5 books - Public Domain)
-- ─────────────────────────────────────────
INSERT INTO books (title, author, description, genre, category, price, image, pdf_url, rating, total_ratings, pages, language)
VALUES

('The Adventures of Tom Sawyer',
 'Mark Twain',
 'A timeless classic about the mischievous Tom Sawyer growing up in the fictional town of St. Petersburg, Missouri in the 1840s. A story of friendship, adventure, and the spirit of childhood.',
 'Adventure', 'free', 0.00,
 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
 'https://www.gutenberg.org/files/74/74-pdf.pdf',
 4.5, 128, 274, 'English'),

('Alice in Wonderland',
 'Lewis Carroll',
 'Young Alice falls through a rabbit hole into a surreal fantasy world of peculiar creatures and absurd adventures. A beloved masterpiece of imaginative literature that has captivated readers for generations.',
 'Fantasy', 'free', 0.00,
 'https://covers.openlibrary.org/b/id/8739162-L.jpg',
 'https://www.gutenberg.org/files/11/11-pdf.pdf',
 4.7, 256, 112, 'English'),

('Frankenstein',
 'Mary Shelley',
 'The story of Victor Frankenstein who creates a living creature in an unorthodox scientific experiment. A haunting Gothic novel that explores the ethics of science, creation, and responsibility.',
 'Horror', 'free', 0.00,
 'https://covers.openlibrary.org/b/id/8739164-L.jpg',
 'https://www.gutenberg.org/files/84/84-pdf.pdf',
 4.6, 310, 322, 'English'),

('The Picture of Dorian Gray',
 'Oscar Wilde',
 'A philosophical novel about a man who sells his soul to remain young while his portrait ages. A brilliant exploration of vanity, corruption, and moral decay in Victorian London.',
 'Classic', 'free', 0.00,
 'https://covers.openlibrary.org/b/id/8739165-L.jpg',
 'https://www.gutenberg.org/files/174/174-pdf.pdf',
 4.8, 445, 254, 'English'),

('Dracula',
 'Bram Stoker',
 'Jonathan Harker travels to Transylvania to assist a mysterious nobleman, Count Dracula. What follows is one of the greatest horror stories ever written — the origin of vampire fiction.',
 'Horror', 'free', 0.00,
 'https://covers.openlibrary.org/b/id/8739160-L.jpg',
 'https://www.gutenberg.org/files/345/345-pdf.pdf',
 4.7, 389, 418, 'English'),

-- ─────────────────────────────────────────
-- PAID BOOKS (5 books)
-- ─────────────────────────────────────────
('Pride and Prejudice',
 'Jane Austen',
 'The witty and romantic story of Elizabeth Bennet and Mr. Darcy. A brilliant social commentary woven through one of the most beloved love stories in English literature. Timeless and endlessly re-readable.',
 'Romance', 'paid', 149.00,
 'https://covers.openlibrary.org/b/id/8739166-L.jpg',
 'https://www.gutenberg.org/files/1342/1342-pdf.pdf',
 4.9, 892, 432, 'English'),

('Sherlock Holmes: A Study in Scarlet',
 'Arthur Conan Doyle',
 'The first appearance of the legendary detective Sherlock Holmes and his loyal companion Dr. Watson. A gripping mystery that introduces one of fiction''s most iconic characters.',
 'Mystery', 'paid', 199.00,
 'https://covers.openlibrary.org/b/id/8739167-L.jpg',
 'https://www.gutenberg.org/files/244/244-pdf.pdf',
 4.8, 567, 188, 'English'),

('Moby Dick',
 'Herman Melville',
 'Captain Ahab''s obsessive quest for the white whale Moby Dick across the ocean. An American epic of human struggle against nature, obsession, and fate. A monumental work of world literature.',
 'Adventure', 'paid', 249.00,
 'https://covers.openlibrary.org/b/id/8739168-L.jpg',
 'https://www.gutenberg.org/files/2701/2701-pdf.pdf',
 4.4, 234, 654, 'English'),

('War and Peace',
 'Leo Tolstoy',
 'A sweeping epic set during the Napoleonic Era, following five aristocratic families in Russia. One of the greatest and most comprehensive novels ever written — a masterpiece of world literature.',
 'Historical', 'paid', 299.00,
 'https://covers.openlibrary.org/b/id/8739169-L.jpg',
 'https://www.gutenberg.org/files/2600/2600-pdf.pdf',
 4.7, 678, 1392, 'English'),

('The Complete Works of Shakespeare',
 'William Shakespeare',
 'The complete collection of Shakespeare''s 37 plays, 154 sonnets, and narrative poems. The cornerstone of English literature and the most influential body of work in the history of drama.',
 'Drama', 'paid', 399.00,
 'https://covers.openlibrary.org/b/id/8739170-L.jpg',
 'https://www.gutenberg.org/files/100/100-pdf.pdf',
 4.9, 1024, 1800, 'English');

SELECT CONCAT('Seeded ', COUNT(*), ' books successfully!') AS message FROM books;
