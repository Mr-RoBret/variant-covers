CREATE USER variantcovers PASSWORD 'JS3g4mk#PeNgcm4';

CREATE DATABASE variantcovers;
ALTER DATABASE variantcovers OWNER TO variantcovers;

CREATE TABLE comics(
    comic_id SERIAL PRIMARY KEY,
    comic_title VARCHAR(255)
);

CREATE TABLE variants(
    comic_id INTEGER,
    comic_title VARCHAR(255),
    thumbnail_url VARCHAR(255),
    cover_artist VARCHAR(255),
);

psql -U variantcovers 