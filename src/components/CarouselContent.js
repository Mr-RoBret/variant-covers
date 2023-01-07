import Slide from "./Slide";
import styles from "./CarouselContent.module.css";

const CarouselContent = (props) => {
    const newCovers = props.covers;

    return (
        newCovers.map((image) => 
            <Slide className={styles.slide} key={image.index} src={image.value} style={{width: props.width}}/>
        )
    );
}

export default CarouselContent;