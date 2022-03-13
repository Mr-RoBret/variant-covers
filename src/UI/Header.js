import { useState } from "react";
import TitleSelector from "./TitleSelector";
import DropDownOptions from "./DropDownOptions";
import Card from './Card';
import styles from './Header.module.css';

const Header = (props) => {

    const [coversList, setCoversList] = useState(['a', 'b', 'c']);

    const handleSelectedTitle = (imagesList) => {
        setCoversList(imagesList);
        console.log(`coversList (state) is currently: ${coversList}`);
    };
    
    props.onChange(coversList);

    return (
        <Card className={styles.header}>
            <h1 className={styles.mainTitle}>The New Variants</h1>
            <div className={styles.selection}>
                <h2 className={styles.subTitle}>Select a Title</h2>
                <select className={styles.dropDown}>
                    <DropDownOptions />
                </select>
            </div>
            <TitleSelector onSelected={handleSelectedTitle}/>
        </Card>
    );
};

export default Header;