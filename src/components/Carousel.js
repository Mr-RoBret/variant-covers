import Slide from "./Slide";
import styles from "./Carousel.module.css";

const Carousel = (props) => {
    let covers = props.covers;
    console.log("Carousel component -- carousel reached");
    console.log(covers);

    return covers.map((img) => 
        <div className={styles.slide}>
            <Slide key={img} src={img.src} />
        </div>
    );
};

export default Carousel;