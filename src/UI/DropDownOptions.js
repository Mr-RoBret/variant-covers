// import Option from '../components/Option';
import { useState } from 'react';
import styles from '../components/Header.module.css';


const DropDownOptions = (props) => {
    
    const itemTitles = props.options;

    // const [currentTitle, setCurrentTitle] = useState('');

    console.log(`itemTitles is currently ${itemTitles}`);
    // console.log(`currentTitle is currently ${currentTitle}`);

    const handleSelection = (event) => {
        console.log(`from DropDownOptions: event.target.value is ${event.target.value}`);
        // setCurrentTitle(event.target.value);
        // console.log(`option selected in DropDown module is ${currentTitle}`);
        props.onChange(event.target.value);
    };

    return (
        <select className={styles.dropDown} onChange={handleSelection}>
            {itemTitles.map((option, index) => (
                <option className={styles.option} key={index} >
                    {option}    
                </option>
            ))}
        </select> 
    );
};

export default DropDownOptions;