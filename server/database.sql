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
    image_url VARCHAR(255),
    image_artst VARCHAR(255),
    CONSTRAINT fk_comics
        FOREIGN KEY(comic_id)
            REFERENCES comics(comic_id)
            ON DELETE CASCADE
);

psql -U variantcovers;
psql -U bfarley -d variantcovers; 