import { useState } from "react";
import TitleSelector from "./TitleSelector";

const Header = (props) => {

    const [coversList, setCoversList] = useState(['a', 'b', 'c']);

    const handleSelectedTitle = (imagesList) => {
        setCoversList(imagesList);
        console.log(`coversList (state) is currently: ${coversList}`);
    };

    props.onChange(coversList);

    return (
        <div>
            <div className="header-module">
                <h2>The New Variants</h2>
                <h3>Select a Title</h3>
                <TitleSelector onSelected={handleSelectedTitle}/>
            </div>
        </div>
    );
};

export default Header;