import React, { useState } from 'react';
import CarouselContent from "./CarouselContent";
import CarouselButton from '../UI/CarouselButton';
import Card from '../UI/Card';
import styles from "./Carousel.module.css";

const Carousel = (props) => {

    const [state, setState] = useState({
        currentIndex: 0,
        translate: 0,
        transition: 0.5
    })
    const { currentIndex, translate, transition } = state;

    const newCovers = props.covers;
    const coversWidth = (newCovers.length * 455).toString() + 'px';

    // transform: translateX(-455px); to move CarouselContent over

    const nextSlide = () => {
        if (currentIndex === newCovers.length - 1) {
            return (setState({
                ...state,
                translate: 0,
                currentIndex: 0
            }))
        }
        setState({
            ...state,
            currentIndex: currentIndex + 1,
            translate: (currentIndex + 1) * 455
        })
    }

    const prevSlide = () => {
        if (currentIndex === 0) {
            return (setState({
                ...state,
                translate: (newCovers.length - 1) * 455,
                currentIndex: newCovers.lenght - 1
            }))
        }
        setState({
            ...state,
            currentIndex: currentIndex - 1,
            translate: (currentIndex - 1) * 455
        })
    }

    const moveContentLeft = () => {
        prevSlide();
    }

    const moveContentRight = () => {
        nextSlide();
    }

    return (
        <div className="whole-carousel">
            <CarouselButton buttonDirection={'buttonLeft'} onClick={moveContentLeft}/>
                <Card>
                    <div className={styles.content} style={{height: '700px', width: coversWidth}}>
                        <CarouselContent covers={newCovers} width={coversWidth} translate={translate} />
                    </div>
                </Card>
            <CarouselButton buttonDirection={'buttonRight'} onClick={moveContentRight} />
        </div>
    );
};

export default Carousel;