import styles from '../components/Header.module.css';

const DropDownOptions = (props) => {
    
    const itemTitles = props.options;

    const handleSelection = (event) => {
        // console.log(`from DropDownOptions: event.target.value is ${event.target.value}`);
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