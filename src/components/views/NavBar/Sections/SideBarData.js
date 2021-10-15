import React from 'react'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SideBarData = [
    {
        title:'Home',
        path:'/',
        icon: "🏡",
        cName: 'nav-text'
    },
    {
        title:'내 갤러리',
        path:'/profile',
        icon: "🧑🏻‍💻",
        cName: 'nav-text'
    },
    {
        title:'my likes',
        path:'/mylikes',
        icon: "👍",
        cName: 'nav-text'
    },
    {
        title:'내 정보 수정하기',
        path:'/update',
        icon: "📑",
        cName: 'nav-text'
    },
    {
        title:'의견 제공 및 문의하기',
        path:'/help',
        icon: "🙋🏻",
        cName: 'nav-text'
    },
]