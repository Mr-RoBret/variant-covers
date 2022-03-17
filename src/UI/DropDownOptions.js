import Option from '../components/Option';
import styles from '../components/Header.module.css';


const DropDownOptions = (props) => {
    
    const itemTitles = props.options;
    console.log(`itemTitles is currently ${itemTitles}`);

    // const handleSelection = (event) => {
    //     console.log('option selected in DropDown module');
    //     props.onSelect(event.target);
    // }

    return (
        itemTitles.map((option) => (
            <Option key={option} option={option} />
        ))
    );
};

export default DropDownOptions;