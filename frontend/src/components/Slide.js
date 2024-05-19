import './Slide.css';

const Slide = (props) => {
    return (
        <div className = "cover-slide">
            <img src={props.src} alt=""></img>
        </div>
    );
}

export default Slide;