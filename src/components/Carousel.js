import React, { useState } from 'react';
import CarouselContent from "./CarouselContent";
import styles from "./Carousel.module.css";

const Carousel = (props) => {
    // const [width, setWidth] = useState('450px')

    const newCovers = props.covers;
    const coversWidth = (newCovers.length * 455).toString() + 'px';
    // setWidth(coversWidth);
    // console.log(coversWidth);

    return (
        // <div className={styles.content}>
        <div className={styles.content} style={{height: '700px', width: coversWidth}}>
            <CarouselContent covers={newCovers} width={coversWidth} />
        </div>
    );
};

export default Carousel;