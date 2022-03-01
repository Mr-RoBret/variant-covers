import Slide from './Slide';

const Carousel = (props) => {
    const coverImages = props.coversList.map((cover) => {
        return <Slide />
    })
}

export default Carousel;