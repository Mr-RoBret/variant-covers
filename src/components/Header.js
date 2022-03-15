// import { useState } from "react";
// import SubmitButton from "../UI/SubmitButton";
import DropDownOptions from "../UI/DropDownOptions";
import styles from './Header.module.css';

import img1 from '../images/slide-1.jpeg';
import img2 from '../images/slide-3.jpeg';
import img3 from '../images/slide-2.jpeg';

const Header = (props) => {

    const imagesList = [
        {key: img1, src: img1}, 
        {key: img2, src: img2}, 
        {key: img3, src: img3}
    ];
    // const [coversList, setCoversList] = useState(['a', 'b', 'c']);
    const titlesList = ['a', 'b', 'c'];

    const handleSelectedTitle = (imagesList) => {
        // setCoversList(coversList);
        // console.log(`coversList (state) is currently: ${coversList}`);
        console.log(imagesList);
        props.onChange(imagesList);
    };
    
    return (  
        <div className={styles.header}>
            <h1 className={styles.mainTitle}>The New Variants</h1>
            <div className={styles.selection}>
                <h2 className={styles.subTitle}>Select a Title</h2>
                <select>
                    <DropDownOptions options={titlesList} onSelect={handleSelectedTitle} />
                </select>
            </div>
            {/* <SubmitButton onSelected={handleSelectedTitle}/> */}
        </div>
    );
};

export default Header;