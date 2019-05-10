import React from "react";

interface IProps {
    title: string;
    caption: string;
    onClick: any;
}

const styles = {
    hidden: {
        display: "none",
    },
    visible: {
        display: "inline-block",
    },
};

const Header = (props: IProps) => {

    const handleClick = (e: any) => {
        e.preventDefault();
        props.onClick();
    };

    return (
        <div className="header">
            <div className="tour-title">
                <div className="tour-name">My 3D Story Tour - {(props.title) ? props.title : "Loading Story Tour..."}</div>
            </div>
            <div className="tour-caption">{props.caption}</div>
            <div
                onClick={handleClick}
                style={(props.title && !props.caption) ? styles.visible : styles.hidden}
                className="tour-start"
            >
                Start tour...
            </div>
        </div>
    );
};

export default Header;
