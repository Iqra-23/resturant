import React from 'react';

function BottomFooter() {
    return (
        <div className="bg-[#1c1c1c]  text-white text-center py-4">
        <p className="text-xs text-white-400">
        © {new Date().getFullYear()}
            <span className="text-red-600 ">WEBINANE</span> 
           All Rights Reserved 
        </p>
       
        </div>
    );
    }
export default BottomFooter;
