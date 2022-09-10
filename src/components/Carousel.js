import React, { useState, useEffect, useContext } from 'react';
import CarouselContent from "./CarouselContent";
import CarouselButton from '../UI/CarouselButton';
import Card from '../UI/Card';
import styles from "./Carousel.module.css";
import IndexContext from '../store/index-context';

const Carousel = (props) => {
    // const coverIndex = props.coverIndex;
    const ctx = useContext(IndexContext);
    console.log(`at beginning of Carousel render, ctx.currentIndex is ${ctx.currentIndex}`);

    const [state, setState] = useState({
        translate: 'translate(0px)',
        transition: '0.5s',
        localIndex: 0
    })
    const { translate, transition, localIndex } = state;
    const newCovers = props.covers;
    const coversWidth = (newCovers.length * 296).toString() + 'px';

    console.log("Carousel Renders");

    // function to move to next slide, or first slide if last slide has been reached
    const moveContentLeft = () => {
        
        if (Number(ctx.currentIndex) === newCovers.length - 1) {
            return (setState({
                ...state,
                translate: 'translate(0px)',
                localIndex: 0
            }))
        }
        return (setState({
            ...state,
            localIndex: Number(localIndex) + 1,
            translate: `translate(${(Number(ctx.currentIndex) + 1) * -296}px)`
        }))
    }

    // function to move slide to previous, unless first slide has been reached
    const moveContentRight = () => {
        
        if (Number(ctx.currentIndex) === 0) {
            return (setState({
                ...state,
                translate: `translate(${(newCovers.length - 1) * -296}px)`,
                localIndex: newCovers.length - 1
            }))
        }
        return (setState({
                ...state,
                translate: `translate(${(Number(ctx.currentIndex) - 1) * -296}px)`,
                localIndex: Number(localIndex) - 1
            })
        )
    }
        
    ctx.currentIndex = localIndex;

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