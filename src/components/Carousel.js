import Slide from "./Slide";
import styles from "./Carousel.module.css";

const Carousel = (props) => {
    const newCovers = props.covers;

    return (
        newCovers.map((image) => 
            <div className={styles.slide}>
                <Slide key={image.index} src={image.value} />
            </div>
        )
    );
};

export default Carousel;