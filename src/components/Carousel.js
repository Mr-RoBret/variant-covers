import React, { useState, useRef, useEffect } from 'react';
import CarouselContent from "./CarouselContent";
import CarouselButton from '../UI/CarouselButton';
import Card from '../UI/Card';
import styles from "./Carousel.module.css";

const Carousel = (props) => {

    const coverIndex = props.coverIndex;
    console.log(`coverIndex is ${coverIndex}`);

    const [state, setState] = useState({
        currentIndex: 0,
        translate: 'translate(0px)',
        transition: '0.5s'
    })
    const { currentIndex, translate, transition } = state;
    const newCovers = props.covers;
    const coversWidth = (newCovers.length * 296).toString() + 'px';

    /**
     * New function for incoming coverIndex that isn't 0
     */
    const prevIndex = useRef();    
    console.log(`currentIndex is ${currentIndex}`);
    console.log(`prevIndex is ${prevIndex.current}`);

    // function to move to next slide, or first slide if last slide has been reached
    const moveContentLeft = () => {
        console.log("moveContentLeft has been called");
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
            translate: `translate(${(currentIndex + 1) * -296}px)`
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
            currentIndex: currentIndex - 1,
            translate: `translate(${(currentIndex - 1) * -296}px)`
        })
    }

    // thumbnail-driven function to move slide to previous slide
    const moveLeftOne = (coverIndex) => {
        if (currentIndex === newCovers.length - 1) {
            return (setState({
                ...state,
                translate: 'translate(0px)',
                currentIndex: coverIndex
            }))
        } else {
            setState({
                ...state,
                currentIndex: coverIndex,
                translate: `translate(${(coverIndex) * -296}px)`
            })
        }
    }

    // thumbnail-driven function to move to next slide
    const moveRightOne = (coverIndex) => {
        console.log("moveContentLeft has been called");
        if (currentIndex === 0) {
            return (setState({
                ...state,
                translate: `translate(${(newCovers.length - 1) * -296}px)`,
                currentIndex: coverIndex
            }))
        } else {
            setState({
                ...state,
                currentIndex: coverIndex,
                translate: `translate(${(coverIndex) * -296}px)`
            })
        }
    }

    /**
     * UseEffect to trigger movement of Carousel based on thumbnail state
     */
    useEffect(() => {
        if (currentIndex > coverIndex) {
            console.log(`currentIndex (${currentIndex}) is greater than coverIndex (${coverIndex}) passed in`);
            setState({
                ...state,
                currentIndex: coverIndex,
            })
            moveLeftOne(coverIndex);
        } else if (currentIndex < coverIndex) {
            console.log(`currentIndex (${currentIndex}) is less than coverIndex (${coverIndex}) passed in`);
            setState({
                ...state,
                currentIndex: coverIndex,
            })
            moveRightOne(coverIndex);
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