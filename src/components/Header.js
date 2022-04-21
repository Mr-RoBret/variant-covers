import { useState, useEffect } from "react";
// import SubmitButton from "../UI/SubmitButton";
import DropDownOptions from "../UI/DropDownOptions";
import styles from './Header.module.css';
import md5 from 'md5';


const Header = (props) => {

    const [currentObjects, setCurrentObjects] = useState([]);
    const [currentTitleObj, setCurrentTitleObj] = useState('');
    const [newTitles, setNewTitles] = useState([]); 
    const [currentTitleID, setCurrentTitleID] = useState('');

    /** 
   ********************************* UseEffect #1 *********************************
   * fetches latest title info and turns them into React-readable data (array?).
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
        const itemsArr = response.data.results.map((item) => {
            const itemArr = [];
            return (
                itemArr.push(item.title, item.id)
            )
        }
        );
        setCurrentObjects(itemsArr);

      const titlesArr = itemsArr.map(item => item[0]);
      setNewTitles(titlesArr);
      console.log(`newTitles, after extracting from itemsArr, is: ${newTitles}.`);

      // setCurrentTitleID to ID of first issue in list
    //   const titleID = response.data.results[0].id.toString();
    //   setCurrentTitleID(titleID);
    }

    // hash.update(currentTimeStamp + privateKey + publicKey);
    // ** initial request URL **
    const requestTitles = `https://gateway.marvel.com:443/v1/public/comics?&ts=${currentTimeStamp}&format=comic&noVariants=false&dateDescriptor=thisWeek&orderBy=title&limit=25&apikey=${publicKey}&hash=${hash}`;
    
    // fetch list of titles from last week and send data to parseData function
    fetch(requestTitles)
    .then(response => response.json())
    .then(data => parseData(data));
  },[newTitles]);

  const handleSelectedTitle = (newTitle) => {
    console.log(`from handleSelectedTitle in Header: newTitle is ${newTitle}`);
    setCurrentTitleObj(newTitle);
    for (let item in currentObjects) {
        if (currentObjects[item].includes(newTitle)) {
            setCurrentTitleObj([item.id, item.title]);
        }
    };
    props.onChange(currentTitleObj);
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