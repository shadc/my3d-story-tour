import React from 'react';
import { checkPropTypes } from 'prop-types';


interface IProps{
    title: string,
    caption: string
    onClick: any
}

const Header = (props: IProps) => (
    <div className="header">
        <div className="tour-title">
            <div className="tour-name">My 3D Story Tour - {props.title}</div>
            <div onClick={() => props.onClick()} className="tour-start">Start tour...</div>
        </div>
        <div id="route-caption">{props.caption}</div>
    </div>
);
  

Header.defaultProps = {
    title: 'Loading Tour',
    caption: ''
}

export default Header;