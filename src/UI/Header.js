import { useState } from "react";
import TitleSelector from "./TitleSelector";
import DropDownOptions from "./DropDownOptions";
import './Header.css'

const Header = (props) => {

    const [coversList, setCoversList] = useState(['a', 'b', 'c']);

    const handleSelectedTitle = (imagesList) => {
        setCoversList(imagesList);
        console.log(`coversList (state) is currently: ${coversList}`);
    };
    
    props.onChange(coversList);

    return (
        <div className="header-module">
            <div>
                <h1>The New Variants</h1>
                <div className="header-selection">
                    <h2>Select a Title</h2>
                    <select className="header-selection__dropDown">
                        <DropDownOptions />
                    </select>
                </div>
                <TitleSelector onSelected={handleSelectedTitle}/>
            </div>
        </div>
    );
};

export default Header;