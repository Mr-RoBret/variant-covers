import Slide from "./Slide";
import styles from "./Carousel.module.css";

const Carousel = (props) => {
    const newCovers = props.covers;
    console.log("Carousel component -- carousel reached");
    console.log(typeof(newCovers));

    return (
        newCovers.map((image) => 
            <div className={styles.slide}>
                <Slide key={image.index} src={image.value} />
            </div>
        )
    );
};

export default Carousel;