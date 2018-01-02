CREATE TABLE IF NOT EXISTS categories(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name VARCHAR(255),
       content TEXT,
       slug VARCHAR(255),
       parent INTEGER DEFAULT null
);
CREATE TABLE IF NOT EXISTS products(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       content TEXT,
       slug VARCHAR(255),
       image_name VARCHAR(255),
       name VARCHAR(255),
       price VARCHAR(20),
       promo VARCHAR(20),
       featured INTEGER,
       brand VARCHAR(40),
       available INTEGER,
       category INTEGER NOT NULL,
       FOREIGN KEY(category) REFERENCES categories(id)
);
CREATE TABLE IF NOT EXISTS pages(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       slug VARCHAR(255),
       title VARCHAR(255),
       menu_order INTEGER DEFAULT NULL,
       content TEXT
);
CREATE TABLE IF NOT EXISTS users(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       username VARCHAR(255),
       email VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS reviews(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       rating INTEGER,
       user INTEGER,
       content TEXT,
       FOREIGN KEY(user) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS login_attempts(
       ip INTEGER,
       attempts INTEGER,
       time INTEGER
);
