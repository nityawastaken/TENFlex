import React, { useState } from 'react'

export const NavBtn = ({ section, selectedSection, setSelectedSection }) => {

    return (
        <li>
            <a href={`#${section}_section`} className={`capitalize hover:text-purple-300 transition-all duration-200
                ${section == selectedSection ? 'text-purple-500' : 'text-white'}
                `}
            onClick={() => setSelectedSection(section)}    
            >
                {section}
            </a>
        </li>
    )
}
