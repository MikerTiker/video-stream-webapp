import React, { useState } from 'react';
import apiClient from "../../Api";

const VideoUpload = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');

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

    const handleUpload = async () => {
        if (!videoFile) {
            alert('Please select a video file to upload.');
            return;
        }
        if (!title) {
            alert('Title is required.');
            return;
        }

        try {
            const response = await apiClient.get('/dir');
            const { id, directory } = response.data;

            const reader = new FileReader();
            reader.readAsArrayBuffer(thumbnailFile);
            reader.onloadend = async () => {
                const thumbnailArrayBuffer = reader.result;

                const payload = {
                    id: id,
                    title: title,
                    description: description,
                    thumbnail: thumbnailArrayBuffer
                };


                // if (videoUploadSuccess) {
                    const uploadResponse = await apiClient.post('/upload', payload);
                    setUploadStatus('Video uploaded successfully!');
                    console.log(uploadResponse.data);
                // } else {
                    setUploadStatus('Failed to save the video file to the directory.');
                // }
            };

            reader.onerror = () => {
                alert('Error reading thumbnail file.');
            };

        } catch (err) {
            setUploadStatus('Error: ' + err.message);
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
                    <input type="file" accept="video/*" onChange={handleFileChange} required />
                </div>
                <div className={"flex gap-2 items-center"}>
                    <div>Thumbnail image:</div>
                    <input type="file" accept="image/*" onChange={handleThumbnailChange} />
                </div>

                <button
                    onClick={handleUpload}
                    className={"bg-blue-700 text-white p-4 rounded-16"}
                >
                    Upload Video
                </button>
                {uploadStatus && <p>{uploadStatus}</p>}
            </div>
        </div>
    );
};

export default VideoUpload;
