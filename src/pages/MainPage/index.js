import React from 'react';
import CustomMenuIcon from "../../Components/CustomMenuIcon";
import ReactPlayer from "react-player/lazy";

const MainPage = () => {
    return (
        <div>
            <CustomMenuIcon/>
            <div className={"grid grid-cols-6 gap-20 py-10 "}>
                <div className={"col-span-1"}>

                </div>
                <div className={"flex flex-col gap-4 items-center col-span-4"}>
                    <div className={"flex gap-10 rounded-24 p-5 items-center w-full h-[300px] bg-pink-100"}>
                        <div className={"rounded-24 m-5"}>
                            <ReactPlayer
                                controls={true}
                                // url={testVideo}
                                light={<img src='/media/khare-khoob.jpeg' alt='Thumbnail'/>}
                                style={{
                                    borderRadius: "16px 16px 16px 16px"
                                }}
                                volume={true}
                                width={"400px"}
                                height={"100%"}
                            />
                        </div>
                        <div className={"w-full flex flex-col gap-4 justify-center text-left"}>
                            <div>
                                title
                            </div>
                            <div>
                                description
                            </div>
                        </div>
                    </div>
                    <div className={"flex gap-10 rounded-24 p-5 items-center w-full bg-pink-100"}>
                        <div className={"rounded-24 m-5"}>
                            <ReactPlayer
                                controls={true}
                                // url={testVideo}
                                light={<img src='/media/khare-khoob.jpeg' alt='Thumbnail'/>}
                                style={{
                                    borderRadius: "16px 16px 16px 16px"
                                }}
                                volume={true}
                                width={"400px"}
                                height={"100%"}
                            />
                        </div>
                        <div className={"w-full flex flex-col gap-4 justify-center text-left"}>
                            <div>
                                title
                            </div>
                            <div>
                                description
                            </div>
                        </div>
                    </div>
                    <div className={"flex gap-10 rounded-24 p-5 items-center w-full h-[300px] bg-pink-100"}>
                        <div className={"rounded-24 m-5"}>
                            <ReactPlayer
                                controls={true}
                                // url={testVideo}
                                light={<img src='/media/khare-khoob.jpeg' alt='Thumbnail'/>}
                                style={{
                                    borderRadius: "16px 16px 16px 16px"
                                }}
                                volume={true}
                                width={"400px"}
                                height={"100%"}
                            />
                        </div>
                        <div className={"w-full flex flex-col gap-4 justify-center text-left"}>
                            <div>
                                title
                            </div>
                            <div>
                                description
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"col-span-1"}>
                </div>
            </div>
        </div>

    );
};

export default MainPage;