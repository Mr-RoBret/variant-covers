import { useState } from "react";
// import SubmitButton from "../UI/SubmitButton";
import DropDownOptions from "../UI/DropDownOptions";
import styles from './Header.module.css';

const Header = (props) => {

    const [currentTitle, setCurrentTitle] = useState(props.titlesList[0]);

    const handleSelectedTitle = (newTitle) => {
        console.log(`from handleSelectedTitle in Header: newTitle is ${newTitle}`);
        setCurrentTitle(newTitle);
        props.onChange(newTitle);
    };
    
    return (  
        <div className={styles.header}>
            <div className={styles.headerElements}>
                <div className={styles.headerLine}></div>
                <h1 className={styles.mainTitle}>The New Variants</h1>
            </div>
            <div className={styles.selection}>
                <h2 className={styles.subTitle}>Select a Title</h2>
                <DropDownOptions options={props.titlesList} onChange={handleSelectedTitle} />
            </div>
            {/* <SubmitButton onSelected={handleSelectedTitle}/> */}
        </div>
    );
};

export default Header;