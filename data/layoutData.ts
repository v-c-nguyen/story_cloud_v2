import IconLibrary from '@/assets/images/parent/footer/icon-library.svg';
import IconPathway from '@/assets/images/parent/footer/icon-pathway.svg';
import IconFocus from '@/assets/images/parent/footer/icon-focus.svg';
import IconDashboard from '@/assets/images/parent/footer/icon-dashboard.svg';
import IconListen from '@/assets/images/parent/footer/icon-listen.svg';
import IconProfile from '@/assets/images/parent/footer/icon-profile.svg';
import IconLearning from '@/assets/images/parent/footer/icon-learning.svg';
import IconExplore from '@/assets/images/parent/footer/icon-explore.svg';
import IconFavourites from '@/assets/images/parent/footer/icon-heart.svg';

export interface HooterItem {
    name: string;
    icon: any; // or proper type for require()
    items?: HooterItem[]
}

export const parentHooterData: HooterItem[] = [
    {
        name: 'Dashboard',
        icon: IconDashboard

    },
    {
        name: 'Learning',
        icon: IconLearning,
        items: [
            {
                name: 'Library',
                icon: IconLibrary
            },
            {
                name: 'Pathway',
                icon: IconPathway
            },
            {
                name: 'Focus',
                icon: IconFocus
            }
        ]
    },
    {
        name: 'Listen',
        icon: IconListen
    },
    {
        name: 'Profile',
        icon: IconProfile
    }
]


export const childHooterData = [
    {
        name: 'Dashboard',
        icon: IconDashboard,
        pathway: true
    },
    {
        name: 'Explore',
        icon: IconExplore,
        pathway: false
    },
    {
        name: 'Favourites',
        icon: IconFavourites,
        pathway: false
    },
    {
        name: 'Listen',
        icon: IconListen,
        pathway: true
    }
]