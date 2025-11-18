import {jwtDecode} from "jwt-decode"

type DecodedToken = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
};
export function loadUser(setAPI : any) {
    const token = localStorage.getItem("token");

        if (token) {
            try {
            const decoded = jwtDecode<DecodedToken>(token);
            //console.log(decoded);

            setAPI(prev => ({
                ...prev,
                user: {
                ...prev.user,
                user_id: decoded.id,
                user_name: decoded.name,
                },
            }));
            } catch (error) {
            console.error("Invalid token:", error);
            }
        }
    }