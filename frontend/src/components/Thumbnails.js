import styles from "./CarouselContent.module.css";

// console.log("Thumbnails Renders");

const Thumbnails = (props) => {
    const thumbnailCovers = props.covers;

    const handleSelectedThumb = (event) => {
        // console.log(event.currentTarget.alt);
        props.onThumbSelect(event.currentTarget.alt);
    }

    return (
        thumbnailCovers.map((coverImage, index) => {
            return ( <img className={styles.slideThumbnail} key={index} src={coverImage.value} alt={index} onClick={handleSelectedThumb} />
        )}
    ));
};

export default Thumbnails;