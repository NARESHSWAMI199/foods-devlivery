import { LocationGeocodedAddress } from "expo-location"
import { UserAction } from "../actions/userActions"
import { UserState,UserModel } from "../models"
import { getToken, getUser } from "../../utils/utils"
import { setTimeout } from "timers"; // Import setTimeout if not already available
import { logInfo } from "../../utils/logger";

const JWT_TOKEN_VALIDITY = 5 * 60 * 60; // 5 hours in seconds
const BUFFER_TIME = 30; // 30 seconds

const initialState : UserState = {
    user : getUser(),
    location : {} as LocationGeocodedAddress,
    error : undefined,
    token : getToken()
}

const userReducer = (state: UserState = initialState, action  : UserAction) => {
    switch(action.type){
        case 'ON_UPDATE_LOCATION' :
            return {
                ...state,
                location : action.payload
            }
        case  'ON_AUTH_LOGIN': 
            return{
                ...state,
                ...action.payload
            };
        case  'ON_AUTH_LOGOUT': 
            return {
                ...state,
                user : action.payload.user,
                token : action.payload.token
            }
        case  'ON_AUTH_ERROR':
            return {
                ...state,
                error : action.payload.error
            }
        default :
            return state
         
    }

}


export { userReducer }