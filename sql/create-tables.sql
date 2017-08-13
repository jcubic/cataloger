CREATE TABLE IF NOT EXISTS categories (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name VARCHAR(255),
       slug VARCHAR(255),
       parent INTEGER DEFAULT null
);
CREATE TABLE IF NOT EXISTS products (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name VARCHAR(255),
       price VARCHAR(20),
       category INTEGER NOT NULL,
       FOREIGN KEY(category) REFERENCES categories(id)
);
CREATE TABLE IF NOT EXISTS pages (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       slug VARCHAR(255),
       title VARCHAR(255),
       menu_order INTEGER DEFAULT NULL,
       content TEXT
);
