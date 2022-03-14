// import { useState } from "react";
// import SubmitButton from "../UI/SubmitButton";
import DropDownOptions from "../UI/DropDownOptions";
import Card from '../UI/Card';
import styles from './Header.module.css';

const Header = (props) => {

    // const [coversList, setCoversList] = useState(['a', 'b', 'c']);
    const titlesList = ['a', 'b', 'c'];

    const handleSelectedTitle = (coversList) => {
        // setCoversList(coversList);
        // console.log(`coversList (state) is currently: ${coversList}`);
        console.log(coversList);
        props.onChange(coversList);
    };
    

    return (  
        <Card className={styles.header}>
            <h1 className={styles.mainTitle}>The New Variants</h1>
            <div className={styles.selection}>
                <h2 className={styles.subTitle}>Select a Title</h2>
                <DropDownOptions options={titlesList} onSelect={handleSelectedTitle} />
            </div>
            {/* <SubmitButton onSelected={handleSelectedTitle}/> */}
        </Card>
    );
};

export default Header;