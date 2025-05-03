import axios from "axios";
import { getServerSession } from "next-auth";

export default function AppBar() {;

    const session = getServerSession();
    console.log(JSON.stringify(session));
    
    return <div className="flex justify-between">
        <div>
            SolCache
        </div>
        
        <div className="flex justify-between">

        </div>
    </div>

}