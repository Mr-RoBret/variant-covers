import styles from "./CarouselContent.module.css";

const Thumbnails = (props) => {

    const thumbnailCovers = props.covers;
    return (
        thumbnailCovers.map((coverImage) => 
            <img className={styles.slideThumbnail} key={coverImage.index} src={coverImage.value} alt=""/>
        )
    );
};

export default Thumbnails;