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
        // console.log(newArray);

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