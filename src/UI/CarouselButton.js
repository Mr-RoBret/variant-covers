import styles from "./CarouselButton.module.css";

const CarouselButton = (props) => {
    console.log(props.img);
    return <p className={styles.buttonText}>{'<'}</p>
        // <div>
         
        // <div className={styles.leftButton}>
        //     <img src={props.img} alt="" />
        // </div>
    
}

export default CarouselButton;