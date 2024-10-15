import React, {useState} from 'react';
import apiClient from "../../Api";

const TempTest = () => {
    const [videoFile, setVideoFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
        } else {
            alert('Please select a valid video file.');
        }
    };
    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('video', videoFile);
            const uploadResponse = await apiClient.post('/test', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("upload file successful",uploadResponse);

        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <div>
            <div className={"flex gap-2 items-center"}>
                <div>Video upload:</div>
                <input type="file" accept="video/*" onChange={handleFileChange} required />
            </div>
            <button
                onClick={handleUpload}
                className={"bg-blue-700 text-white p-4 rounded-16"}
            >
                Upload Video
            </button>
        </div>
    );
};

export default TempTest;