import styles from "./CarouselButton.module.css";

const CarouselButton = (props) => {

    if (props.buttonDirection === 'buttonLeft') {
        return (
            <p className={styles.buttonText}>{'<'}</p>
        );
    }
    return (
        <p className={styles.buttonText}>{'>'}</p>
    );
        // <div>
         
        // <div className={styles.leftButton}>
        //     <img src={props.img} alt="" />
        // </div>
    
}

export default CarouselButton;