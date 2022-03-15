import React from "react";
// import styles from './Option.module.css';

const Option = (props) => {
    // <option className={styles.option} onClick={props.onClick}>
    return (
        <option className="option">
            {props.option}    
        </option>
    );
};

export default Option;