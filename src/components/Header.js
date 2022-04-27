import { useState, useEffect, useRef } from "react";
// import SubmitButton from "../UI/SubmitButton";
import DropDownOptions from "../UI/DropDownOptions";
import styles from './Header.module.css';
import md5 from 'md5';

const Header = (props) => {

    const [newTitles, setNewTitles] = useState([]); 
    const itemsArr = useRef([]);
    
    /** 
     ********************************* UseEffect #1 *********************************
     * fetches latest title info and turns them into React-readable object.
     * then sends titles to dropdown, which, upon a selection, hands the info up to 
     * App, so its variants can be selected
     */
    
    
    useEffect(() => {
        const privateKey = process.env.REACT_APP_API_SECRET;
        const publicKey = process.env.REACT_APP_API_PUBLIC;
        // create API fetch request params
        const currentTimeStamp = Date.now().toString();
        const message = currentTimeStamp + privateKey + publicKey;
        const hash = md5(message);
        
        // parseData takes API data and maps week's titles into array of titles
        const parseData = (response) => {
            
            // map this week's titles into new array and setNewTitles to array
            itemsArr.current = itemsArr.current.concat(response.data.results.map((item) => {
                return {id: item.id, title: item.title};
            }));

            const titlesArr = [];
            for (let i in itemsArr.current) {
                titlesArr.push(itemsArr.current[i].title);
            }

        setNewTitles(titlesArr);
        console.log(`newTitles, after extracting from itemsArr, are: ${titlesArr}.`);
        }

    // ** initial request URL **
    const requestTitles = `https://gateway.marvel.com:443/v1/public/comics?&ts=${currentTimeStamp}&format=comic&noVariants=false&dateDescriptor=thisWeek&orderBy=title&limit=25&apikey=${publicKey}&hash=${hash}`;
    
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
            currentTitleObj.push({id: id, title: title});
            currentTitleID = id;
        }
    };
    props.onChange(currentTitleObj, currentTitleID);
  };
    
    return (  
        <div className={styles.header}>
            <div className={styles.headerElements}>
                <div className={styles.headerLine}></div>
                <h1 className={styles.mainTitle}>The New Variants</h1>
            </div>
            <div className={styles.selection}>
                <h2 className={styles.subTitle}>Select a Title</h2>
                <DropDownOptions options={newTitles} onChange={handleSelectedTitle} />
            </div>
            {/* <SubmitButton onSelected={handleSelectedTitle}/> */}
        </div>
    );
};

export default Header;