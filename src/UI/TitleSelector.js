import img1 from '../images/slide-1.jpeg';
import img2 from '../images/slide-3.jpeg';
import img3 from '../images/slide-2.jpeg';

const TitleSelector = () => {
    console.log('Return Title');
    const imagesList = [img1, img2, img3];
    console.log(`imagesList is currently ${imagesList}.`);    
    return imagesList;
}

export default TitleSelector;