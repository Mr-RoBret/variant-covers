import styles from "./CarouselButton.module.css";

const CarouselButton = (props) => {

    const handleClick = (event) => {
        props.onClick(event.target.value)
    }

    if (props.buttonDirection === 'buttonLeft') {
        return (
            <div className={styles.buttonText} onClick={handleClick}>{'<'}</div>
        );
    }
    return (
        <div className={styles.buttonText} onClick={handleClick}>{'>'}</div>
    ); 
}

export default CarouselButton;