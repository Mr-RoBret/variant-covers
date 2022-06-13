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
        newIndex: coverIndex,
        translate: 'translate(0px)',
        transition: '0.5s'
    })
    const { currentIndex, newIndex, translate, transition } = state;
    const newCovers = props.covers;
    const coversWidth = (newCovers.length * 296).toString() + 'px';

    // currentIndex = Number(currentIndex);
    console.log(`Carousel beginning; currentIndex is ${currentIndex}, type ${typeof(currentIndex)} and newIndex is ${newIndex}`);

    // function to move to next slide, or first slide if last slide has been reached
    const moveContentLeft = () => {
        if (Number(currentIndex) === newCovers.length - 1) {
            console.log("moveContentLeft has been called w/ currentIndex === newCovers.length - 1");
            return (setState({
                ...state,
                translate: 'translate(0px)',
                newIndex: 0,
                currentIndex: 0
            }))
        }
        console.log("moveContentLeft has been called w/ currentIndex !== newCovers.length - 1");
        setState({
            ...state,
            newIndex: Number(currentIndex) + 1,
            currentIndex: Number(currentIndex) + 1,
            translate: `translate(${(currentIndex + 1) * -296}px)`
        })
    }

    // function to move slide to previous, unless first slide has been reached
    const moveContentRight = () => {
        if (currentIndex === 0) {
            console.log('moveContentRight called w/ currentIndex === 0')
            return (setState({
                ...state,
                translate: `translate(${(newCovers.length - 1) * -296}px)`,
                newIndex: newCovers.length - 1,
                currentIndex: newCovers.length - 1
            }))
        }
        console.log('moveContentRight called w/ currentIndex !== 0')
        setState({
            ...state,
            translate: `translate(${(currentIndex - 1) * -296}px)`,
            newIndex: currentIndex - 1,
            currentIndex: currentIndex - 1
        })
    }

    // thumbnail-driven function to move slide to previous slide
    const moveLeftOne = (coverIndex) => {
        console.log("moveRightOne has been called");
        setState({
            ...state,
            translate: `translate(${(coverIndex) * -296}px)`,
            newIndex: Number(coverIndex),
            currentIndex: Number(coverIndex)
        })
        console.log(`state set in moveLeftOne; newIndex is ${state.newIndex} and currentIndex is ${state.currentIndex}`)    
    }

    // thumbnail-driven function to move to next slide
    const moveRightOne = (coverIndex) => {
        console.log("moveRightOne has been called");
        setState({
            ...state,
            newIndex: Number(coverIndex),
            currentIndex: Number(coverIndex),
            translate: `translate(${(coverIndex) * -296}px)`
        })
        
    }

    /**
     * UseEffect to trigger movement of Carousel based on thumbnail state
     */
    useEffect(() => {
        console.log('useEffect called')
        if (currentIndex > coverIndex) {
            console.log(`currentIndex (${currentIndex}) is greater than coverIndex (${coverIndex}) passed in`);
            moveRightOne(coverIndex);
        } else if (currentIndex < coverIndex) {
            console.log(`currentIndex (${currentIndex}) is less than coverIndex (${coverIndex}) passed in`);  
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