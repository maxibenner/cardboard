import { firebase } from '../lib/firebase';


//Get signed upload url and create file doc
export async function getSignedUploadUrl(file) {

    // Extract information from filename (with dot safety)
    const partsArray = file.name.split('.')
    const extension = partsArray.pop()
    const fileName = partsArray.join('.')

    const res = await firebase.functions().httpsCallable('signUploadUrl')({
        contentType: file.type,
        name: file.name
    })

    return {
        url: res.data.url,
        uuid: res.data.uuid,
        key: res.data.key,
        name: fileName
    }
}

//Check if file exists on Wasabi
export async function checkWasabiFile(key) {
    return await firebase.functions().httpsCallable('checkWasabiFile')(key)
}



