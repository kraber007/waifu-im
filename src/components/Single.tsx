import './Single.css'

interface Props{
    urlList: string[],
    index: number
}

export default function Single(props: Props){
    return (
        <div className='single'>
            <img src={props.urlList[props.index]} />   
        </div>
    )
}