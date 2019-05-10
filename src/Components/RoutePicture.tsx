import React from "react";

interface IProps {
    picAction: [number, string];
    caption: string;
    img: string;
    id: number;
    height: string;
}

const status = {
    active: "animateIn",
    deactive: "animateOut",
};

const RoutePicture = (props: IProps) => {

    // -- Determine height (as css variable) for each image once deactiveated.
    const formatHeight: any = (height: string) => {
        return {"--tx": height};
    };

    const getLiClass = (id: number, picAction: [number, string]) => {
        // For testing
        // return 'polaroidCenter animateRight';

        if (id === picAction[0] && picAction[1] === "deactive") { return "polaroidCenter animateRight"; }
        if (id < picAction[0]) { return "polaroidCenter animateRight"; }
        return "polaroidCenter";
    };

    const getDivClass = (id: number, picAction: [number, string]) => {
        // For testing
        // return 'polaroid animateOut';

        if (id > picAction[0]) { return "polaroid polaroidInitial"; }
        if (id === picAction[0]) {
            return "polaroid " + status[picAction[1] as keyof typeof status];
        } else {
            return "polaroid animateOut";
        }
    };

    return (
        <li style={formatHeight(props.height)} className={getLiClass(props.id, props.picAction)} >
        <div className={getDivClass(props.id, props.picAction)} >
          <img className="picImage" src={props.img} />
          <div>{props.caption}</div>
        </div>
    </li>
    );
};

RoutePicture.defaultProps = {
    picAction: [0, ""],
};

export default RoutePicture;
