import React, { useState } from 'react';
import CarouselContent from "./CarouselContent";
import CarouselButton from '../UI/CarouselButton';
import Card from '../UI/Card';
import styles from "./Carousel.module.css";

const Carousel = (props) => {

    const [state, setState] = useState({
        currentIndex: 0,
        translate: 'translate(0px)',
        transition: '0.5s'
    })
    const { currentIndex, translate, transition } = state;
    const newCovers = props.covers;
    const coversWidth = (newCovers.length * 455).toString() + 'px';

    // function to move to next slide, or first slide if last slide has been reached
    const moveContentLeft = () => {
        if (currentIndex === newCovers.length - 1) {
            return (setState({
                ...state,
                translate: 'translate(0px)',
                currentIndex: 0
            }))
        }
        setState({
            ...state,
            currentIndex: currentIndex + 1,
            translate: `translate(${(currentIndex + 1) * -455}px)`
        })
    }

    // function to move slide to previous, unless first slide has been reached
    const moveContentRight = () => {
        if (currentIndex === 0) {
            return (setState({
                ...state,
                translate: `translate(${(newCovers.length - 1) * -455}px)`,
                currentIndex: newCovers.length - 1
            }))
        }
        setState({
            ...state,
            currentIndex: currentIndex - 1,
            translate: `translate(${(currentIndex - 1) * -455}px)`
        })
    }

    return (
        <div className="whole-carousel">
            <CarouselButton buttonDirection={'buttonLeft'} onClick={moveContentRight}/>
                <Card>
                    <div className={styles.content} style={{height: '700px', width: coversWidth, transform: translate, transition: transition}}>
                        <CarouselContent covers={newCovers} width={coversWidth} />
                    </div>
                </Card>
            <CarouselButton buttonDirection={'buttonRight'} onClick={moveContentLeft} />
        </div>
    );
};

export default Carousel;