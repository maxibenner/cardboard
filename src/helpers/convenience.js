
//Removes any "." from the fileName without affecting the extension
export function removeDotsKeepExtension(string) {

    const partsArray = string.split('.')
    const arrayLength = partsArray.length
    const extension = partsArray.splice(arrayLength - 1, 1)
    const newName = partsArray.join('-')
    const sanitizedNameWithExtension = `${newName}.${extension}`

    return sanitizedNameWithExtension
}
