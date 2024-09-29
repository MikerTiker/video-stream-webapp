import React from 'react';

const MainPage = () => {
    return (
        <div className={"grid grid-cols-6 gap-20 py-10 "}>
            <div className={"col-span-1"}>

            </div>
            <div className={"flex flex-col gap-4 items-center col-span-4"}>
                <div className={"flex gap-10 rounded-24 p-5 items-center w-full h-[300px] bg-pink-100"}>
                    <div className={"w-full h-full bg-pink-100 object-cover"}>
                        <img src="/media/khare-khoob.jpeg" className={"w-full h-full object-contain"} alt=""/>
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
                    <div className={"w-full h-full bg-pink-100 object-cover"}>
                        <img src="/media/khare-khoob.jpeg" className={"w-full h-full object-contain"} alt=""/>
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
                    <div className={"w-full h-full bg-pink-100 object-cover"}>
                        <img src="/media/khare-khoob.jpeg" className={"w-full h-full object-contain"} alt=""/>
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

    );
};

export default MainPage;