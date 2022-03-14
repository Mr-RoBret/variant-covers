import Option from '../components/Option';
import styles from '../components/Header.module.css';

import img1 from '../images/slide-1.jpeg';
import img2 from '../images/slide-3.jpeg';
import img3 from '../images/slide-2.jpeg';

const imagesList = [
    {key: img1, src: img1}, 
    {key: img2, src: img2}, 
    {key: img3, src: img3}];

const DropDownOptions = (props) => {
    
    const renderItems = () => {
        const itemTitles = props.options.map((item) => (item.title));
        console.log(itemTitles);
         
        // const finalOptions = [...new Set(itemTitles)];
        // console.log(finalOptions);
        
        return itemTitles.map((option) => (
            // <Option onClick={props.onClick} key={option} option={option} />
            <Option key={option} option={option} />
        ));
    };
    
    const handleSelection = (event) => {
        props.onSelect(imagesList);
    };

    return (
        // <select className={styles.dropDown} onSelect={handleSelection}>
        <select className={styles.dropDown} onSelect={handleSelection}>
            {renderItems}
        </select>
    );
};

export default DropDownOptions;