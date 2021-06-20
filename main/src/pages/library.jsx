import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdCloudUpload } from "react-icons/md";
import Button from "../components/button";
import ButtonLight from "../components/buttonLight";
import CardSimple from "../components/cardSimple/CardSimple";
import DropdownFull from "../components/dropdownFull";
import Navbar from "../components/navbar";
import Uploader from "../components/uploader/Uploader";
import BrowseContainer from "../containers/browse/Browse";
import LabelFile from "../containers/labelFile/LabelFile";
import ShareContainer from "../containers/shareContainer/ShareContainer";
import TagSearch from "../containers/tagSearch/TagSearch";
import WatchContainer from "../containers/watch/WatchContainer";
import { FileContext } from "../context/FileContext";
import { useAuthListener } from "../hooks/use-auth-listener";
import { firebase } from "../lib/firebase";
import placeholder from "../media/illustration-empty.svg";
import styles from "./library.module.css";




export default function Library() {
    //__________ VARS __________//
    const { user } = useAuthListener();

    //__________ REFS __________//
    const formRef = useRef(null);
    const inputRef = useRef(null);

    //__________ STATE __________//
	const files = useContext(FileContext)

    const [numberOfDeliveries, setNumberofDeliveries] = useState(0)
    const [filesForUpload, setFilesForUpload] = useState([]);

    const [activeMedia, setActiveMedia] = useState(null);
    const [selection, setSelection] = useState([]);
    const [visibleFiles, setVisibleFiles] = useState();

    const [tags, setTags] = useState([]);
    const [activeTags, setActiveTags] = useState([]);

    //__________ FUNCTIONS __________//

    // Handle UPLOAD click
    const handleUploadClick = () => {
        inputRef.current.click();
    };

    // Handle file upload selection
    const onFileChange = (e) => {
        setFilesForUpload(
            // Set files
            [...e.target.files],
            // Callback: Reset input
            formRef.current.reset()
        );
    };

    // Set active file
    const handleActiveMedia = (fileObject, action) => {
        // Available actions are: "show", "label", "share"

        // Show placeholder
        setActiveMedia(() => {
            const ph = {
                type: false,
                action: action,
            };
            return ph;
        });

        // Remove active media if null
        if (!fileObject) {
            setActiveMedia(null);
            return;
        }

        // Display file
        if (action === "show") {
            //Set action
            fileObject.action = "show";

            if (fileObject === null) {
                return setActiveMedia(fileObject);
            } else {
                firebase
                    .functions()
                    .httpsCallable("sign_wasabi_download_url")(fileObject)
                    .then((url) => {
                        fileObject.url = url.data;
                        setActiveMedia(fileObject);
                    });
            }
        } else if (action === "label") {
            // Label file

            // Set action
            fileObject.action = "label";

            // Set active media
            setActiveMedia(fileObject);
        } else if (action === "share") {
            // Set action
            fileObject.action = "share";

            // Set active media
            setActiveMedia(fileObject);
        }
    };

    // Handle file navigation
    const handleWatchNavigatin = (pressedKey) => {
        // Get new visible index of only files
        const slideShowFiles = visibleFiles.filter((element) => {
            return element.display_type === "file";
        });

        // Get index of currently active element in visibleFiles array
        const indexOfActiveFile = slideShowFiles.findIndex(
            (file) => file.id === activeMedia.id
        );

        // Previous/Next file
        if (pressedKey === "ArrowRight") {
            // Check if last file
            if (indexOfActiveFile + 1 === slideShowFiles.length) {
                // Back to start
                handleActiveMedia(slideShowFiles[0], "show");
            } else {
                // Next
                handleActiveMedia(
                    slideShowFiles[indexOfActiveFile + 1],
                    "show"
                );
            }
        } else if (pressedKey === "ArrowLeft") {
            // Check if first file
            if (indexOfActiveFile === 0) {
                // Back to end
                handleActiveMedia(
                    slideShowFiles[slideShowFiles.length - 1],
                    "show"
                );
            } else {
                // Previous
                handleActiveMedia(
                    slideShowFiles[indexOfActiveFile - 1],
                    "show"
                );
            }
        }
    };

    //__________ EFFECTS __________//

    // Get number of deliveries
    useEffect(()=>{

        // Early return
        if(files === null) return

        // Count number of deliveries
        var counter = 0
        files.forEach((file)=>{
            if(file.business !== undefined && file.accepted === false){
                counter ++
            }
        })

        // Update counter state
        setNumberofDeliveries(counter)

    },[files])

    // Get thumbnail urls
    useEffect(() => {
        // Add thumbnail url
        if (files) {
            files.forEach(async (file) => {
                //Check if file has thumbnail_key => add thumbnail_url if it doesn't exist
                if (file.thumbnail_key && file.thumbnail_url === undefined) {
                    // Get download url
                    const url = await firebase
                        .storage()
                        .ref()
                        .child(file.thumbnail_key)
                        .getDownloadURL();

                    // Update firestore
                    firebase
                        .firestore()
                        .collection("users")
                        .doc(user.uid)
                        .collection("files")
                        .doc(file.id)
                        .update({
                            thumbnail_url: url,
                        });
                }
            });
        }
    }, [files, user.uid]);

    // Set tags
    useEffect(() => {
        var newTagArray = [];

        // Put all tags into one array
        files &&
            files.forEach((file) => {
                // Push tag if unique
                file.tags &&
                    file.tags.forEach((tag) => {
                        !newTagArray.includes(tag) && newTagArray.push(tag);
                    });
            });

        setTags(newTagArray);
    }, [files]);

    // Refresh currently active media on file change
    useEffect(() => {
        if (!activeMedia) return;

        // Get action type
        const type = activeMedia.action;

        // Get updated file
        const updatedFile = files.filter((el) => el.id === activeMedia.id);

        // Merge updated file and action type
        updatedFile[0].action = type;

        // Update
        setActiveMedia(() => updatedFile[0]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    // Keep selected files in sync
    useEffect(() => {
        const updatedSelectionFiles = [];

        selection.forEach((file) => {
            updatedSelectionFiles.push(
                files.filter((el) => el.id === file.id)[0]
            );
        });

        setSelection(updatedSelectionFiles);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    //__________ RENDER __________//
    return (
        <div className={styles.wrapper}>
            <Navbar loggedIn /*to={ROUTES.LIBRARY}*/ />
            {files && files.length > numberOfDeliveries && (
                <div className={styles.spacer70}></div>
            )}
            {files && files.length > numberOfDeliveries && (
                <div className={styles.searchBarContainer}>
                    <TagSearch tags={tags} setActiveTags={setActiveTags} />
                </div>
            )}
            {files &&
                files.length > numberOfDeliveries && ( // Action container
                    <div className={styles.actionContainer}>
                        <DropdownFull
                            down
                            icon={
                                <ButtonLight
                                    title="More"
                                    icon={<IoMdArrowDropdown />}
                                />
                            }
                        >
                            <ButtonLight
                                title={"Upload"}
                                icon={<MdCloudUpload />}
                                onClick={handleUploadClick}
                            />
                        </DropdownFull>
                    </div>
                )}
            {files && files.length > numberOfDeliveries && (
                <BrowseContainer
                    files={files}
                    activeTags={activeTags}
                    user={user}
                    firebase={firebase}
                    sendSelectionToParent={setSelection}
                    sendVisibleFilesToParent={setVisibleFiles}
                    handleActiveMedia={handleActiveMedia}
                />
            )}
            {files !== null &&
                files.length <= numberOfDeliveries && ( // Placeholder for no files
                    <div className={styles.noFilesWrapper}>
                        <CardSimple
                            large
                            imgSrc={placeholder}
                            title={"Looks empty here"}
                            button={
                                <Button
                                    blue
                                    wide
                                    onClick={handleUploadClick}
                                    text={"Upload your first memory"}
                                />
                            }
                        />
                    </div>
                )}
            {activeMedia && activeMedia.action === "show" && (
                <WatchContainer
                    activeMedia={activeMedia}
                    handleActiveMedia={handleActiveMedia}
                    handleWatchKeydown={handleWatchNavigatin}
                    thumbnail={"#"}
                />
            )}
            {activeMedia && activeMedia.action === "label" && (
                <LabelFile
                    handleModal={handleActiveMedia}
                    file={activeMedia}
                    user={user}
                    firebase={firebase}
                />
            )}
            {selection[0] && (
                <ShareContainer
                    handleModal={setSelection}
                    selection={selection}
                    user={user}
                    firebase={firebase}
                />
            )}
            {filesForUpload.length > 0 && (
                <Uploader
                    inputRef={inputRef}
                    files={filesForUpload}
                    user={user}
                    firebase={firebase}
                />
            )}
            <form ref={formRef}>
                <input
                    className={styles.hiddenInput}
                    type="file"
                    multiple
                    ref={inputRef}
                    onChange={onFileChange}
                />
            </form>
        </div>
    );
}
