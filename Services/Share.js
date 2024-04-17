import { Share } from "react-native";

const SharePlace = (place) => {
    Share.share({
        title: 'Share Place',
        message: 'Check out this place: ' + 
        place.name + ' at \n' + 
        (place.vicinity ? place.vicinity : place.formatted_address)+ '.',

    })
}

export default {SharePlace};