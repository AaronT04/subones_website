


function HorizontalRadioButton(props) {
    return(<div className="flex gap-2">
            <input type="radio" value={props.value} checked={props.checked} onChange={props.onChange} name={props.name}/>
            <label>{props.value}</label>
        </div>
    )
}
export default HorizontalRadioButton