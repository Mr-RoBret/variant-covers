import { useState, useEffect, useRef } from "react";
import DropDownOptions from "../UI/DropDownOptions";
import styles from './Header.module.css';
import md5 from 'md5';
import logo from "../images/title_logo.png";

const PORT = process.env.PORT || 5000;

const Header = (props) => {

    const [newTitles, setNewTitles] = useState([]);
    const initialTitleID = useRef('');
    const itemsArr = useRef([]);

    useEffect(() => {

        // parseData takes comics table data and maps week's titles into array of titles
        const parseData = (response) => {
            const comicsWithVariantsOnly = Array.from(response);
            itemsArr.current = itemsArr.current.concat(comicsWithVariantsOnly.map((item) => {
                return { id: item.comic_id, title: item.comic_title };
            }
            ));
            console.log(`itemsArr.current[0].id is ${itemsArr.current[0].id}`);
            initialTitleID.current = itemsArr.current[0].id;

            const titlesArr = [];
            for (let i in itemsArr.current) {
                titlesArr.push(itemsArr.current[i].title);
            }

            setNewTitles(titlesArr);
            props.onLoad(initialTitleID.current);
        }

        // ** Loads comic titles **

        const requestTitles = `${process.env.REACT_APP_API_URL}/comics`;

        // fetch list of titles from last week and send data to parseData function
        fetch(requestTitles)
            .then(response => response.json())
            // .then(response => console.log(response))
            .then(data => parseData(data));
    }, []);

    if (newTitles === undefined) {
        return <p>Still loading...</p>;
    }

    const handleSelectedTitle = (newTitle) => {

        const currentTitleObj = [];
        let currentTitleID = '';

        for (let item in itemsArr.current) {
            if (itemsArr.current[item].title === newTitle) {
                const id = JSON.stringify(itemsArr.current[item].id);
                const title = itemsArr.current[item].title;

                currentTitleObj.push({ id: id, title: title });
                currentTitleID = id;
            }
        };
        props.onChange(currentTitleObj, currentTitleID);

    };

    return (
        <div className={styles.header}>
            <div className={styles.headerElements}>
                <div className={styles.headerLogo}>
                    <img src={logo} alt="the new variants logo"></img>
                </div>
            </div>
            <div className={styles.selection}>
                <h2 className={styles.subTitle}>Select a title from this week's releases to see its variants:</h2>
                <DropDownOptions options={newTitles} onChange={handleSelectedTitle} />
            </div>
        </div>
    );
};

export default Header;