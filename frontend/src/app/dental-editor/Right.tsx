
import Dental from '../../components/temp-allcomponents/Dental'
import { useDentalEditorContext } from "./DentalEditorContext"

function Right(props) {
    const {dentalContext} = useDentalEditorContext();
    return(
            <div>   
                <Dental dentalContext={dentalContext}/>
            </div>

    )
} export default Right