import React, { useState, useContext, Fragment } from 'react';
import CarouselContent from "./CarouselContent";
import CarouselButton from '../UI/CarouselButton';
import Card from '../UI/Card';
import styles from "./Carousel.module.css";
import IndexContext from '../store/index-context';
import Thumbnails from './Thumbnails';

const Carousel = (props) => {

    const ctx = useContext(IndexContext);

    const [state, setState] = useState({
        translate: 'translate(0px)',
        transition: '0.5s',
        localIndex: ctx.currentIndex
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

    const handleSelectedThumb = (index) => {
        setState({
            ...state,
            translate: `translate(${(Number(index)) * -296}px)`,
            localIndex: index
        })
    }
        
    ctx.currentIndex = localIndex;

    return (
        <Fragment>
            <div className="whole-carousel">
                <CarouselButton buttonDirection={'buttonLeft'} onClick={moveContentRight}/>
                    <Card>
                        <div className={styles.content} style={{height: '700px', width: coversWidth, transform: translate, transition: transition}}>
                            <CarouselContent covers={newCovers} width={coversWidth} />
                        </div>
                    </Card>
                <CarouselButton buttonDirection={'buttonRight'} onClick={moveContentLeft} />
            </div>
            <div>
                <IndexContext.Provider value={{
                    currentIndex: localIndex,
                    onThumbSelect: handleSelectedThumb,
                }}>
                    <div className="thumbnail-grid">
                        <Thumbnails covers={newCovers} onThumbSelect={handleSelectedThumb} />
                    </div>
                </IndexContext.Provider>
            </div>
        </Fragment>
    );
};

export default Carousel;