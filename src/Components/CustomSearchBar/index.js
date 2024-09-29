import React, {useState} from 'react';

const CustomSearchBar = ({onSearch}) => {
    const [searchText,setSearchText] = useState("");
    const handleSearch=(e)=>{
        setSearchText(e.target.value)
    };
    const handleClick=()=>{
        onSearch(searchText)
    };
    const handleKeyDown=(e)=>{
        if(e.key === 'Enter'){
            handleClick();
        }
    };
    return (
        <div className={"flex items-center justify-center px-4 py-5 "}>
            <div className={"relative outline-none select-none"}>
                <input
                    type="text"
                    className={"bg-purple-50 rounded-24 py-2 px-4 pr-12"}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                />
                <div
                    className={"absolute right-3 top-2 cursor-pointer"}
                    onClick={handleClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <circle cx="10.5" cy="10.5" r="7" stroke="currentColor" stroke-width="2"/>
                        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </div>
            </div>

        </div>
    );
};

export default CustomSearchBar;