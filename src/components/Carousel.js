import React, { useState, useEffect, useContext } from 'react';
import CarouselContent from "./CarouselContent";
import CarouselButton from '../UI/CarouselButton';
import Card from '../UI/Card';
import styles from "./Carousel.module.css";
import IndexContext from '../store/index-context';

const Carousel = (props) => {
    // const coverIndex = props.coverIndex;
    const ctx = useContext(IndexContext);

    const [state, setState] = useState({
        currentIndex: 0,
        translate: 'translate(0px)',
        transition: '0.5s'
    })
    const { currentIndex, translate, transition } = state;
    const newCovers = props.covers;
    const coversWidth = (newCovers.length * 296).toString() + 'px';

    console.log("Carousel Renders");

    // function to move to next slide, or first slide if last slide has been reached
    const moveContentLeft = () => {
        
        if (Number(ctx.currentIndex) === newCovers.length - 1) {
            return (setState({
                ...state,
                translate: 'translate(0px)',
                currentIndex: 0
            }))
        }
        return (setState({
            ...state,
            currentIndex: Number(currentIndex) + 1,
            translate: `translate(${(Number(currentIndex) + 1) * -296}px)`
        }))
    }

    // function to move slide to previous, unless first slide has been reached
    const moveContentRight = () => {
        if (Number(ctx.currentIndex) === 0) {
            return (setState({
                ...state,
                translate: `translate(${(newCovers.length - 1) * -296}px)`,
                currentIndex: newCovers.length - 1
            }))
        }
        return (setState({
                ...state,
                translate: `translate(${(Number(currentIndex) - 1) * -296}px)`,
                currentIndex: Number(currentIndex) - 1
            })
        )
    }

    // thumbnail-driven function to move slide to previous slide
    const moveLeftOne = (coverIndex) => {
        setState({
            ...state,
            translate: `translate(${Number(coverIndex) * -296}px)`,
            currentIndex: Number(coverIndex)
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
        if (currentIndex > ctx.currentIndex) {
            moveRightOne(ctx.currentIndex);
        } else if (currentIndex < ctx.currentIndex) {
            moveLeftOne(ctx.currentIndex);
        } else {
            console.log("the index has not changed");
        }
    }, [currentIndex]);

    // props.onChange(coverIndex);

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