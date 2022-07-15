import React, { useState, useEffect } from 'react';
import CarouselContent from "./CarouselContent";
import CarouselButton from '../UI/CarouselButton';
import Card from '../UI/Card';
import styles from "./Carousel.module.css";
import { FirstRender } from '../util/FirstRender';

const Carousel = (props) => {

    const firstRender = FirstRender;
    const coverIndex = props.coverIndex;

    const [state, setState] = useState({
        currentIndex: 0,
        translate: 'translate(0px)',
        transition: '0.5s'
    })
    const { currentIndex, translate, transition } = state;
    const newCovers = props.covers;
    const coversWidth = (newCovers.length * 296).toString() + 'px';

    // function to move to next slide, or first slide if last slide has been reached

    const moveContentLeft = () => {
        if (Number(currentIndex) === newCovers.length - 1) {
            return (setState({
                ...state,
                translate: 'translate(0px)',
                currentIndex: 0
            }))
        }
        setState({
            ...state,
            currentIndex: Number(currentIndex) + 1,
            translate: `translate(${(Number(currentIndex) + 1) * -296}px)`
        })
    }

    // function to move slide to previous, unless first slide has been reached
    const moveContentRight = () => {
        if (currentIndex === 0) {
            return (setState({
                ...state,
                translate: `translate(${(newCovers.length - 1) * -296}px)`,
                currentIndex: newCovers.length - 1
            }))
        }
        setState({
            ...state,
            translate: `translate(${(Number(currentIndex) - 1) * -296}px)`,
            currentIndex: currentIndex - 1
        })
    }

    // thumbnail-driven function to move slide to previous slide
    const moveLeftOne = (coverIndex) => {
        setState({
            ...state,
            translate: `translate(${(coverIndex) * -296}px)`,
            currentIndex: coverIndex
            /* 
                update carousel based on new current Index...
            **/
        })
    }

    // thumbnail-driven function to move to next slide
    const moveRightOne = (coverIndex) => {
        setState({
            ...state,
            currentIndex: Number(coverIndex),
            translate: `translate(${Number(coverIndex) * -296}px)`
        })
    }

    /**
     * UseEffect to trigger movement of Carousel based on thumbnail state
     */
    useEffect(() => {
        if (currentIndex > coverIndex) {
            moveRightOne(coverIndex);
        } else if (currentIndex < coverIndex) {
            moveLeftOne(coverIndex);
        } else {
            console.log("the index has not changed");
        }
    }, [coverIndex]);

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