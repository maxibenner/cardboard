import React, { useState, useEffect } from 'react'
import SearchBar from '../../components/searchBar'
import Tag from '../../components/tag'
import styles from './styles.module.css'


export default function TagSearch(props) {

    const [activeTags, setActiveTags] = useState([])

    // Add tag
    const addTag = (tag) => {
        console.log(tag)

        // Check if tag already exists
        const duplicate = activeTags.some((existingTag) => existingTag === tag)

        // Add tag to activeTags
        if(!duplicate){
            setActiveTags(existingTags => [...existingTags, tag])
        }
        
    }

    // Remove tag
    const removeTag = (tag) => {
        console.log(tag)

        // Check if tag exists
        const exists = activeTags.some((existingTag) => existingTag === tag)

        // Remove tag to activeTags
        if(exists){
            setActiveTags(activeTags.filter((existingTag)=> existingTag !== tag))
        }
        
    }

    // Send active tags to parents
    useEffect(()=>{

        props.setActiveTags(activeTags)

    },[activeTags])

    return (
        <div className={styles.wrapper}>
            <SearchBar onSubmit={addTag} />
            <div className={styles.tagWrapper}>
                {activeTags.map((tag)=>{
                    return <Tag title={tag} onCancel={removeTag} key={tag} />
                })}
            </div>
        </div>
    )
}
