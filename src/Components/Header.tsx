import React from 'react';

interface IProps{
    title: string,
    caption: string
    onClick: any
}

const styles = {
    visible:  {
        display: "inline-block",
    } as React.CSSProperties,
    hidden:  {
        display: "none",
    } as React.CSSProperties
} 

const Header = (props: IProps) => (
    <div className="header">
        <div className="tour-title">
            <div className="tour-name">My 3D Story Tour - {(props.title) ? props.title : "Loading Story Tour..."}</div>
        </div>
        <div className="tour-caption">{props.caption}</div>
        <div 
            onClick={() => props.onClick()} 
            style={(props.title && !props.caption) ? styles.visible : styles.hidden}
            className="tour-start">
            Start tour...
        </div>
    </div>
);
  
export default Header;