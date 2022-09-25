import React, { useState, useContext, useEffect, Fragment } from 'react';
import CarouselContent from "./CarouselContent";
import CarouselButton from '../UI/CarouselButton';
import Card from '../UI/Card';
import styles from "./Carousel.module.css";
import IndexContext from '../store/index-context';
import Thumbnails from './Thumbnails';

const Carousel = (props) => {

    const ctx = useContext(IndexContext);
    // console.log(`ctx.currentIndex is ${ctx.currentIndex}`);
    // console.log(`ctx.currentIndex is type ${typeof(ctx.currentIndex)}`);

    const [state, setState] = useState({
        translate: 'translate(0px)',
        transition: '0.5s',
        localIndex: Number(ctx.currentIndex)
    })
    const { translate, transition, localIndex } = state;

    const newCovers = props.covers;
    const coversWidth = (newCovers.length * 296).toString() + 'px';

    console.log("Carousel Renders");
    // ctx.currentIndex = localIndex;

    // function to move to next slide, or first slide if last slide has been reached
    const moveContentLeft = () => {

        if (Number(ctx.currentIndex) >= newCovers.length - 1) {
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
        
        if (Number(ctx.currentIndex) <= 0) {
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
        
    // useEffect(() => { 
    //     console.log(`setting localIndex to zero.`);
    //     ctx.currentIndex = 0;
    //     setState({
    //         ...state,
    //         localIndex: ctx.currentIndex
    //     })
    // }, [ctx]);

    ctx.currentIndex = localIndex;
    console.log(`ctx.currentIndex is ${ctx.currentIndex}`);

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