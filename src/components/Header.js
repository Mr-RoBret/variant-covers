import { useState } from "react";
// import SubmitButton from "../UI/SubmitButton";
import DropDownOptions from "../UI/DropDownOptions";
import styles from './Header.module.css';

import img1 from '../images/slide-1.jpeg';
import img2 from '../images/slide-3.jpeg';
import img3 from '../images/slide-2.jpeg';

const Header = (props) => {

    const defaultList = [
        {key: img1, src: img1}, 
        {key: img2, src: img2}, 
        {key: img3, src: img3}
    ];
        console.log(`defaultList is currently ${defaultList}`);

    const [coversList, setCoversList] = useState([]);

    const titlesList = ['Option 1', 'Option 2', 'Option 3'];

    const handleSelectedTitle = (e) => {
        console.log(`the dropdown selection was ${e.target.value}`);
        setCoversList(defaultList)
        console.log(`coversList is currently ${coversList}`);
        props.onChange(coversList);
    };
    
    return (  
        <div className={styles.header}>
            <h1 className={styles.mainTitle}>The New Variants</h1>
            <div className={styles.selection}>
                <h2 className={styles.subTitle}>Select a Title</h2>
                <select className={styles.dropDown} onChange={handleSelectedTitle}>
                    <DropDownOptions options={titlesList} />
                </select>
            </div>
            {/* <SubmitButton onSelected={handleSelectedTitle}/> */}
        </div>
    );
};

export default Header;