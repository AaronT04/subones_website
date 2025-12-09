
import Dental from '@/components/editor/Dental'
import { useDentalEditorContext } from "./context"

function Right(props) {
    const {dentalContext} = useDentalEditorContext();
    return(
            <div>   
                <Dental dentalContext={dentalContext}/>
            </div>

    )
} export default Right