import React, { useState, useEffect } from 'react'
import SearchBar from '../../components/searchBar'
import Tag from '../../components/tag'
import styles from './styles.module.css'


export default function TagSearch(props) {

    const [activeTags, setActiveTags] = useState([])
    const [randomPlaceholder, setRandomPlaceholder] = useState()

    // Add tag
    const addTag = (tag) => {

        // Check if tag already exists
        const duplicate = activeTags.some((existingTag) => existingTag === tag)

        // Add tag to activeTags
        if (!duplicate) {
            setActiveTags(existingTags => [...existingTags, tag.toLowerCase()])
        }

    }

    // Remove tag
    const removeTag = (tag) => {

        // Check if tag exists
        const exists = activeTags.some((existingTag) => existingTag === tag)

        // Remove tag to activeTags
        if (exists) {
            setActiveTags(activeTags.filter((existingTag) => existingTag !== tag))
        }

    }

    // Send active tags to parents
    useEffect(() => {

        props.setActiveTags(activeTags)

    }, [activeTags])

    // Set random tag placeholder
    useEffect(() => {

        if (props.tags.length !== 0) {

            // Get random tag from tag array
            const randomTag = props.tags[Math.floor(Math.random() * props.tags.length)]

            // Set random placeholer
            setRandomPlaceholder(`Try searching for "${randomTag}"`)

        }


    }, [props.tags])


    return (
        <div className={styles.wrapper}>
            <SearchBar onSubmit={addTag} placeholder={randomPlaceholder} />
            <div className={styles.tagWrapper}>
                {activeTags.map((tag) => {
                    return <Tag title={tag} onCancel={removeTag} key={tag} />
                })}
            </div>
        </div>
    )
}
