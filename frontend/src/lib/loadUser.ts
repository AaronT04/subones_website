import {jwtDecode} from "jwt-decode"

import type {DecodedToken} from "@/lib/api/types"

export function loadUser(setAPI? : any) {
    const token = localStorage.getItem("token");

        if (token) {
            try {
            const decoded = jwtDecode<DecodedToken>(token);
            //console.log(decoded);
            if(setAPI) {
                setAPI(prev => ({
                    ...prev,
                    user: {
                    ...prev.user,
                    user_id: decoded.id,
                    user_name: decoded.name,
                    },
                }));
            }
            return decoded;
            } catch (error) {
            console.error("Invalid token:", error);
            }
        }
    }