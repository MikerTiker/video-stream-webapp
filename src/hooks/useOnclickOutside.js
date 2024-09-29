import React, {useEffect} from 'react';

const UseOnclickOutside = (ref,func) => {
    useEffect(() => {

        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                func()
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

        handleClickOutside(ref)
    }, [ref]);
}

export default UseOnclickOutside;