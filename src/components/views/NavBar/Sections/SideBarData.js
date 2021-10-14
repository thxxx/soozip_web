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
        title:'의견 및 오류 제보',
        path:'/reports',
        icon: "📑",
        cName: 'nav-text'
    },
    {
        title:'이메일 문의하기',
        path:'/help',
        icon: "🙋🏻",
        cName: 'nav-text'
    },
]