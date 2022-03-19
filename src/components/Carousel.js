import Slide from "./Slide";
import styles from "./Carousel.module.css";

const Carousel = (props) => {
    let covers = props.covers;
    console.log("Carousel component -- carousel reached");
    console.log(covers);

    let singleIssueCovers = covers.map((img) => {
        return (
            <div className={styles.slide}>
                <Slide key={img.key} src={img.src} />
            </div>
        );
    });

    return singleIssueCovers;
};

export default Carousel;