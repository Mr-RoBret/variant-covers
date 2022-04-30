import CarouselContent from "./CarouselContent";
import styles from "./Carousel.module.css";


const Carousel = (props) => {
    const newCovers = props.covers;

    return (
        <div className={styles.content}>
            <CarouselContent covers={newCovers} />
        </div>
    );
};

export default Carousel;