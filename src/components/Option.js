import React from "react";
import styles from './Option.module.css';

const Option = (props) => {

    return (
        <option className={styles.option}>
            {props.option}    
        </option>
    );
};

export default Option;