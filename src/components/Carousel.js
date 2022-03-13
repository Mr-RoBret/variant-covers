import Slide from "./Slide";
import Card from '../UI/Card';

const Carousel = (props) => {
    let covers = props.covers;
    console.log("Carousel component -- carousel reached");
    console.log(covers);

    let singleIssueCovers = covers.map((img) => {
        return (
            <div>
                <Slide key={img.key} src={img.src} />
            </div>
        );
    });

    return singleIssueCovers;
};

export default Carousel;