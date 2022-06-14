Skip to content
Search or jump to…
Pull requests
Issues
Marketplace
Explore
 
@AlexKardone 
htmlacademy-nodejs
/
144889-typoteka-3
Public
Code
Pull requests
Actions
Projects
Security
Insights
Личный проект: приручить слона #13
 Merged
dean992008 merged 2 commits into htmlacademy-nodejs:master from dimalapeto:module5-task1 on 26 Apr 2021
+71 −15 
 Conversation 0
 Commits 2
 Checks 0
 Files changed 4
File filter 
 
Личный проект: приручить слона
 master (#13)
Dzmitry Lapeta committed on 26 Apr 2021
commit 345069ed9b6c4260a1e4668e2b9f91ed3e88a66f
 54  
schema.sql
@@ -0,0 +1,54 @@
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles_categories;

CREATE TABLE categories
(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(255) NOT NULL
);

CREATE TABLE users
(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email varchar(100) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  avatar varchar(50) NOT NULL 
);

CREATE TABLE articles
(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  announce text NOT NULL,
  fullText text NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  user_id integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE comments
(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text text NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  user_id integer NOT NULL,
  article_id integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (article_id) REFERENCES articles (id)
);

CREATE TABLE articles_categories
(
	article_id integer NOT NULL,
	category_id integer NOT NULL,
	CONSTRAINT articles_categories_pk PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles (id),
	FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE INDEX ON articles (title);
© 2022 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
Loading complete