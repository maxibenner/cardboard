import React, { useContext } from 'react';
import useContent from '../hooks/use-content';
import getGroups from '../utils/group-map';
import BrowseContainer from '../containers/browse';
import styles from './home.module.css';

export default function Home() {

    const { clips } = useContent("clips");
    const groups = getGroups(clips)

    return <BrowseContainer clips={clips} groups={groups}/>
};
