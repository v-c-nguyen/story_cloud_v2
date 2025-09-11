import IconFreeMode from "@/assets/images/icons/icon-free-mode.svg"
import IconFocusMode from "@/assets/images/icons/icon-focus-mode.svg"
import IconPathwayMode from "@/assets/images/icons/icon-pathway-mode.svg"

import IconProfile from "@/assets/images/parent/footer/icon-profile.svg"
import IconContent from "@/assets/images/icons/icon-content.svg"
export interface ChildItem {
    name: string;
    avatar: any; // or proper type for require()
    mode: string
}

export interface modeProp {
    id: string,
    name: string,
    avatar: any
}


export interface TabItem {
    id: string,
    icon: any,
    label: string
};

export const childrenData: ChildItem[] = [
    {
        name: 'Mia',
        avatar: require("@/assets/images/parent/dashboard/Mia_60x60.png"),
        mode: 'focus'

    },
    {
        name: 'Jesse',
        avatar: require("@/assets/images/parent/dashboard/Jesse_60x60.png"),
        mode: 'pathway'
    }
]

export const modesData: modeProp[] = [
    {
        id: 'focus',
        name: 'Focus',
        avatar: IconFocusMode
    },
    {
        id: 'pathway',
        name: 'Pathway',
        avatar: IconPathwayMode
    },
    {
        id: 'free',
        name: 'Free',
        avatar: IconFreeMode
    }
]

export const tabData: TabItem[] =
    [
        { id: 'account', label: 'Account', icon: IconProfile },
        { id: 'content', label: 'Content', icon: IconContent }
    ];
