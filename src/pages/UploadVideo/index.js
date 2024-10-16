import React, {useRef, useState} from 'react';
import apiClient from "../../Api";
import { Oval } from 'react-loader-spinner';

const VideoUpload = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const videoInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
        } else {
            alert('Please select a valid video file.');
        }
    };

    const handleThumbnailChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setThumbnailFile(file);
        } else {
            alert('Please select a valid image file for the thumbnail.');
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };


    const handleUpload = async () => {
        if (!videoFile || !title) {
            alert('Please upload a video and provide a title.');
            return;
        }

        setIsLoading(true);
        setUploadStatus('');
        setProgress(0);

        try {
            const formData = new FormData();
            formData.append('video', videoFile);

            // Convert thumbnail to byte array (base64)
            const thumbnailBase64 = thumbnailFile ? await fileToBase64(thumbnailFile) : null;

            // metadata object
            const payload = JSON.stringify ({
                title: title,
                description: description,
                thumbnail: thumbnailBase64
            });

            formData.append('metadata', new Blob([payload], { type: 'application/json' }));

            const uploadResponse = await apiClient.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const total = progressEvent.total;
                    const current = progressEvent.loaded;
                    const percentCompleted = Math.round((current / total) * 100);
                    setProgress(percentCompleted);
                },
            });

            console.log("Upload file successful", uploadResponse);
            alert(uploadResponse.data.message)
            setUploadStatus(uploadResponse.data.message);

            // Reset form fields after successful upload
            setTitle('');
            setDescription('');
            setVideoFile(null);
            setThumbnailFile(null);
            videoInputRef.current.value = '';
            thumbnailInputRef.current.value = '';

        } catch (error) {
            console.error("Error uploading file", error);
            setUploadStatus("Error during upload.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={"flex flex-col items-center justify-center h-screen"}>
            <div className={"flex flex-col gap-5 items-center justify-center w-fit p-4 bg-gray-300 rounded-24"}>
                <h1>Video Upload</h1>
                <div className={"flex flex-col gap-4"}>
                    <input
                        type="text"
                        placeholder="Video Title (required)"
                        className={"outline-none bg-gray-100 rounded-12 p-4"}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        className={"outline-none bg-gray-100 rounded-12 p-4"}
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className={"flex gap-2 items-center"}>
                    <div>Video upload:</div>
                    <input
                        type="file"
                        accept="video/*"
                        disabled={isLoading}
                        ref={videoInputRef}
                        onChange={handleFileChange} required />
                </div>
                <div className={"flex gap-2 items-center"}>
                    <div>Thumbnail image:</div>
                    <input
                        type="file"
                        accept="image/*"
                        disabled={isLoading}
                        ref={thumbnailInputRef}
                        onChange={handleThumbnailChange} />
                </div>

                <div className="flex flex-col gap-4 w-full items-center">

                    <button
                        onClick={handleUpload}
                        className={"bg-blue-700 text-white p-4 rounded-16 w-fit flex items-center justify-center relative"}
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <Oval
                                height={20}
                                width={20}
                                color="#fff" // Spinner color
                                wrapperStyle={{marginRight: '8px'}}
                                visible={true}
                                ariaLabel='oval-loading'
                                secondaryColor="#fff"/>
                        )}
                        {isLoading ? 'Uploading...' : 'Upload Video'}
                    </button>

                    {isLoading && (
                        <div className="w-full h-2 bg-gray-200 rounded-20">
                            <div
                                className="bg-blue-600 h-full rounded-20"
                                style={{width: `${progress}%`}}
                            ></div>
                        </div>
                    )}
                </div>

                {uploadStatus &&
                    <p>{uploadStatus}</p>
                }
            </div>
        </div>
    );
};

export default VideoUpload;
