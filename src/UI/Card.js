import React from "react";

import styles from './Card.module.css';

const Card = (props) => {
    return <div className={`${styles.card} ${props.className}`} width={props.width}>{props.children}</div>
};

export default Card;