import { removeDotsKeepExtension } from './convenience';
import { v4 as uuidv4 } from 'uuid';
import { firebase } from '../lib/firebase.dev';


//Get signed upload url
export async function getSignedUploadUrl(file) {

    const uuid = uuidv4()
    const sanitizedFileName = removeDotsKeepExtension(file.name)

    const url = await firebase.functions().httpsCallable('signUploadUrl')({
        id: uuid,
        originalName: sanitizedFileName,
        contentType: file.type,
        extension: sanitizedFileName.split('.')[1]
    })

    return {
        url: url,
        uuid: uuid
    }
}

