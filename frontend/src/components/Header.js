import { useState, useEffect, useRef } from "react";
import DropDownOptions from "../UI/DropDownOptions";
import styles from './Header.module.css';
import md5 from 'md5';
import logo from "../images/title_logo.png";

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

        // parseData takes API data and maps week's titles into array of titles
        const parseData = (response) => {

            const variantsOnly = Array.from(response.data.results);
            const newArray = variantsOnly.filter((item) => item.variants.length > 1);

            // map this week's titles into new array and setNewTitles to array
            itemsArr.current = itemsArr.current.concat(newArray.map((item) => {
                return { id: item.id, title: item.title };
            }
            ));

            initialTitleID.current = itemsArr.current[0].id;

            const titlesArr = [];
            for (let i in itemsArr.current) {
                titlesArr.push(itemsArr.current[i].title);
            }

            setNewTitles(titlesArr);
            // console.log(`newTitles, after extracting from itemsArr, are: ${titlesArr}.`);
            // console.log(`initialTitleID is ${initialTitleID.current}`);
            props.onLoad(initialTitleID.current);
        }

        // ** initial request URL **
        // const requestTitles = `https://gateway.marvel.com:443/v1/public/comics?&ts=${currentTimeStamp}&format=comic&noVariants=false&dateDescriptor=thisMonth&orderBy=title&limit=100&apikey=${publicKey}&hash=${hash}`;
        const requestTitles = `https://gateway.marvel.com:443/v1/public/comics?&ts=${currentTimeStamp}&format=comic&noVariants=false&dateRange=${dateRange}&orderBy=title&limit=100&apikey=${publicKey}&hash=${hash}`;

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
                {/* <div className={styles.headerLine}></div> */}
                {/* <h1 className={styles.mainTitle}>The New Variants</h1> */}
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