
import img1 from '../images/slide-1.jpeg';
import img2 from '../images/slide-3.jpeg';
import img3 from '../images/slide-2.jpeg';

const TitleSelector = (props) => {

    const imagesHandler = () => {
        console.log('Return Title');
        const imagesList = [
            {key: img1, src: img1}, 
            {key: img2, src: img2}, 
            {key: img3, src: img3}];
        console.log(`imagesList is currently ${imagesList}.`);    
        props.onSelected(imagesList);
    }

    return (
        <div className="submit-button">
            <button onClick={imagesHandler}>See Variants</button>
        </div>
    )
};

export default TitleSelector;