import Option from '../components/Option';
import styles from '../components/Header.module.css';


const DropDownOptions = (props) => {
    
    const itemTitles = props.options;
    console.log(`itemTitles is currently ${itemTitles}`);

    const handleSelection = (event) => {
        props.onSelect(event.target.value);
    }

    return (
        // <select className={styles.dropDown} >
        itemTitles.map((option) => (
            <Option onClick={handleSelection} key={option} option={option} />
        ))
        // </select>
    );
};

export default DropDownOptions;