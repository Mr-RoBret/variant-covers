import React, { useState, useContext, useEffect, Fragment } from 'react';
import CarouselContent from "./CarouselContent";
import CarouselButton from '../UI/CarouselButton';
import Card from '../UI/Card';
import styles from "./Carousel.module.css";
import IndexContext from '../store/index-context';
import Thumbnails from './Thumbnails';

const Carousel = (props) => {

    const coverWidth = 553;
    const ctx = useContext(IndexContext);

    const [state, setState] = useState({
        translate: 'translate(0px)',
        transition: '0.5s',
        localIndex: Number(ctx.currentIndex)
    })
    const { translate, transition, localIndex } = state;

    const newCovers = props.covers;
    console.log(newCovers);

    // const coversWidth = (newCovers.length * Number(coverWidth)).toString() + 'px';
    const getCoversWidth = (newCovers) => {
        let coversWidth = 0;
        for (let item of newCovers) {
            coversWidth += item[2].value;
        }
        return coversWidth.toString() + 'px';
    }

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
            translate: `translate(${(Number(ctx.currentIndex) + 1) * -Number(coverWidth)}px)`
        }))
    }

    // function to move slide to previous, unless first slide has been reached
    const moveContentRight = () => {
        
        if (Number(ctx.currentIndex) <= 0) {
            return (setState({
                ...state,
                translate: `translate(${(newCovers.length - 1) * -Number(coverWidth)}px)`,
                localIndex: newCovers.length - 1
            }))
        }
        return (setState({
                ...state,
                translate: `translate(${(Number(ctx.currentIndex) - 1) * -Number(coverWidth)}px)`,
                localIndex: Number(localIndex) - 1
            })
        )
    }

    const handleSelectedThumb = (index) => {
        setState({
            ...state,
            translate: `translate(${(Number(index)) * -Number(coverWidth)}px)`,
            localIndex: index
        })
    }
        
    // resets thumbnail/carousel to zero upon selection of new title
    useEffect(() => { 
        handleSelectedThumb(0)  
    }, [ctx]);

    // updates context variable for rest of app
    ctx.currentIndex = localIndex;
    console.log(newCovers);

    return (
        <Fragment>
            <div className="whole-carousel">
                <CarouselButton buttonDirection={'buttonLeft'} onClick={moveContentRight}/>
                    {/* <Card width={coverWidth + 'px'}> */}
                    <Card>
                        <div className="content" style={{display: 'flex', height: 'auto', width: '553px', transform: translate, transition: transition}}>
                            <CarouselContent covers={newCovers} width={coverWidth + 'px'} />
                        </div>
                    </Card>
                <CarouselButton buttonDirection={'buttonRight'} onClick={moveContentLeft} />
            </div>
            <div className={styles.artistInfo}>
                <p>{newCovers[0] ? 'Cover artist: ' + newCovers[localIndex].artist : 'loading...'}</p>
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