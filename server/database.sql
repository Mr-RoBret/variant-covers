CREATE USER variantcovers PASSWORD 'JS3g4mk#PeNgcm4';

CREATE DATABASE variantcovers;
ALTER DATABASE variantcovers OWNER TO variantcovers;

CREATE TABLE comics(
    comic_id SERIAL PRIMARY KEY,
    comic_title VARCHAR(255)
);