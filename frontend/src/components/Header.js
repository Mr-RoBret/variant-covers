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

    /** 
     * useEffect fetches latest title info and turns into React-readable object.
     * Then sends titles to dropdown, which, upon a selection, hands the info up to 
     * App, so its variants can be selected
     */

    useEffect(() => {
        // if *some condition* get new list of comics and parse into array of only comics
        // with variants
        const privateKey = process.env.REACT_APP_API_SECRET;
        const publicKey = process.env.REACT_APP_API_PUBLIC;

        // create API fetch request params
        const currentTimeStamp = Date.now().toString();
        const currentDate = new Date().toISOString().split('T')[0];

        // Calculate the number of milliseconds in two weeks
        const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000;

        // Subtract two weeks from the current date
        const twoWeeksAgo = new Date(currentTimeStamp - twoWeeksInMilliseconds);
        const prevDate = twoWeeksAgo.toISOString().split('T')[0];
        const dateRange = `${prevDate}, ${currentDate}`;
        const message = currentTimeStamp + privateKey + publicKey;
        const hash = md5(message);

        // refreshDB takes API data and maps week's titles into array of titles
        const refreshDB = async (response) => {

            const comicsWithVariantsOnly = Array.from(response.data.results);
            const newArray = comicsWithVariantsOnly.filter((item) => item.variants.length > 1);
            console.log(newArray);

            for (let i in newArray) {

                try {
                    const id = (newArray[i]['id']);;
                    const title = newArray[i]['title'];

                    await fetch('http://localhost:5000/comics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            comic_id: id,
                            comic_title: title
                        })
                    });
                } catch (err) {
                    console.error(err.message);
                }
            }

        }
        const requestTitles = `https://gateway.marvel.com:443/v1/public/comics?&ts=${currentTimeStamp}&format=comic&noVariants=false&dateRange=${dateRange}&orderBy=title&limit=100&apikey=${publicKey}&hash=${hash}`;

        fetch(requestTitles)
            .then(response => response.json())
            .then(data => refreshDB(data));


    }, []);

    useEffect(() => {

        // parseData takes comics table data and maps week's titles into array of titles
        const parseData = (response) => {
            // console.log(response);
            const comicsWithVariantsOnly = Array.from(response);

            itemsArr.current = itemsArr.current.concat(comicsWithVariantsOnly.map((item) => {
                return { id: item.comic_id, title: item.comic_title };
            }
            ));
            // console.log(itemsArr);
            initialTitleID.current = itemsArr.current[0].id;

            const titlesArr = [];
            for (let i in itemsArr.current) {
                titlesArr.push(itemsArr.current[i].title);
            }

            setNewTitles(titlesArr);
            props.onLoad(initialTitleID.current);
        }

        // ** initial request URL **

        /** UPDATE TO DB PROCESS */
        /** Replace this call with api endpoint that queries database for titles instead */
        // const requestTitles = `https://gateway.marvel.com:443/v1/public/comics?&ts=${currentTimeStamp}&format=comic&noVariants=false&dateRange=${dateRange}&orderBy=title&limit=100&apikey=${publicKey}&hash=${hash}`;
        const requestTitles = `http://localhost:5000/comics`;

        // fetch list of titles from last week and send data to parseData function
        fetch(requestTitles)
            .then(response => response.json())
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