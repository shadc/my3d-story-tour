import React from 'react';

interface IProps{
    picAction: (string | number)[];
    caption: string,
    img: string,
    id: number,
    height:string
}

const status = {
    active: 'animateIn',
    deactive: 'animateOut'
};

//-- Determine height (as css variable) for each image once deactiveated.
const formatHeight : any = (height : string) => {
    return {'--tx':height}
};

const getLiClass = (props : IProps) => {
    //For testing   
    //return 'polaroidCenter animateRight';

    if (props.id == props.picAction[0] && props.picAction[1] == 'deactive') return 'polaroidCenter animateRight';
    if (props.id < props.picAction[0]) return 'polaroidCenter animateRight';
    return 'polaroidCenter';
};

const getDivClass = (props : IProps) => {
    //For testing   
    //return 'polaroid animateOut';

    if (props.id > props.picAction[0]) return 'polaroid polaroidInitial';
    if (props.id == props.picAction[0]) {
        return 'polaroid ' + status[props.picAction[1] as keyof typeof status]
    }else{
         return 'polaroid animateOut'
    }
}


const RoutePicture = (props: IProps) => (
    <li style={formatHeight(props.height)} className={getLiClass(props)} > 
        <div className={getDivClass(props)} >
          <img className="picImage" src={props.img} /> 
          <div>{props.caption}</div>
        </div>
    </li>
);
  
export default RoutePicture;