
export default function getGroups(clips){

    const groupedClips = clips.filter(x => x.group);
    const clipArray = groupedClips.map(x => x.group);
    const groupSet = new Set(clipArray);
    const groups = [...groupSet];

    return groups
}

