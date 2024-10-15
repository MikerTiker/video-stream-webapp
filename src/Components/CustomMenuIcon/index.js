import React, {useRef, useState} from 'react';
import useOnclickOutside from "../../hooks/useOnclickOutside";
import {Link, useNavigate} from "react-router-dom";
// import useSignOut from "react-auth-kit/hooks/useSignOut";
// import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";


const CustomMenuIcon = ({className}) => {
    // const isAuthenticated = useIsAuthenticated();
    // const signOut = useSignOut();
    const [isMenuOpen,setIsMenuOpen] = useState(false);
    const toggleMenu =()=>{
        setIsMenuOpen((prev)=>!prev)
    };
    const menu = useRef()
    useOnclickOutside(menu,()=>{setIsMenuOpen(false)})

    return (
        <div className={`${className}`} ref={menu}>
            <div className={"absolute top-7 right-10 cursor-pointer z-10"}
                 onClick={toggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <rect width="24" height="3" fill="currentColor"/>
                    <rect y="10" width="24" height="3" fill="currentColor"/>
                    <rect y="20" width="24" height="3" fill="currentColor"/>
                </svg>
            </div>
            <div className={`absolute top-0 right-0 bg-pink-500 text-magneta-50 text-18 transition-all opacity-96 duration-500 ${isMenuOpen? "w-80 " :"w-0 overflow-hidden"}  h-screen flex flex-col gap-5 justify-center items-center`}
                 style={{borderRadius:"15px 0 0 15px"}}>

                <Link to={'/'}>
                    <div className={"cursor-pointer w-fit whitespace-nowrap"}>
                        Main Page
                    </div>
                </Link>

                <Link to={'/upload-video'}>
                    <div className={"cursor-pointer w-fit whitespace-nowrap"}>
                        Upload Video
                    </div>
                </Link>
                <Link to={'/test'}>
                    <div className={"cursor-pointer w-fit whitespace-nowrap"}>
                        test
                    </div>
                </Link>

                {/*{isAuthenticated &&*/}
                {/*    <Link to={'/login'}>*/}
                {/*        <div className={"cursor-pointer w-fit whitespace-nowrap"}*/}
                {/*             onClick={()=>{signOut();alert("you Logged Out")}}>*/}
                {/*            Log-out*/}
                {/*        </div>*/}
                {/*    </Link>*/}
                {/*}*/}
                {/*{!isAuthenticated &&*/}
                {/*    <Link to={'/login'}>*/}
                {/*        <div className={"cursor-pointer w-fit whitespace-nowrap"}>*/}
                {/*            Login*/}
                {/*        </div>*/}
                {/*    </Link>*/}
                {/*}*/}

            </div>
        </div>
    );
};

export default CustomMenuIcon;