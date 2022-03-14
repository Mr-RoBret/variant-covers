import styles from './SubmitButton.module.css'
import img1 from '../images/slide-1.jpeg';
import img2 from '../images/slide-3.jpeg';
import img3 from '../images/slide-2.jpeg';

// takes selectedIssue from props and retrieves list of covers for that issue
const SubmitButton = (props) => {

    const imagesHandler = (event) => {
        console.log('Return Title');
        const imagesList = [
            {key: img1, src: img1}, 
            {key: img2, src: img2}, 
            {key: img3, src: img3}];
        console.log(`imagesList is currently ${imagesList}.`);    
        props.onSelected(imagesList);
    }

    return (
        <div className={styles.seeVariant}>
            <button className={styles.submitButton} onClick={imagesHandler}>See Variants</button>
        </div>
    )
};

export default SubmitButton;