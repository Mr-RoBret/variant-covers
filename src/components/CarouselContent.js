import Slide from "./Slide";
import styles from "./CarouselContent.module.css";

const CarouselContent = (props) => {
    const newCovers = props.covers;
    // const translateX = {transform: `translate(${props.translate}px)`};
    // console.log(translateX);
    
    return (
        // <div style={{transform: translateX}} >
            newCovers.map((image) => 
                <div className={styles.slide}>
                    <Slide key={image.index} src={image.value} />
                </div>
            )
        // </div>
    );
}

export default CarouselContent;