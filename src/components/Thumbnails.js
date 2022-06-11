import styles from "./CarouselContent.module.css";

const Thumbnails = (props) => {
    const thumbnailCovers = props.covers;

    const handleSelectedThumb = (event) => {
        props.onThumbSelect(event.currentTarget.alt);
    }

    return (
        thumbnailCovers.map((coverImage, index) => {
            return ( <img className={styles.slideThumbnail} key={index} src={coverImage.value} alt={index} onClick={handleSelectedThumb} />
        )}
    ));
};

export default Thumbnails;