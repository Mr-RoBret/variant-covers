import styles from "./CarouselButton.module.css";

const CarouselButton = (props) => {

    const handleClick = (event) => {
        props.onClick(event.target.value)
    }

    if (props.buttonDirection === 'buttonLeft') {
        return (
            <p className={styles.buttonText} onClick={handleClick}>{'<'}</p>
        );
    }
    return (
        <p className={styles.buttonText} onClick={handleClick}>{'>'}</p>
    ); 
}

export default CarouselButton;