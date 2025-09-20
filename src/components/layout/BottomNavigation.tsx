import { NavLink } from 'react-router-dom';
import homeIcon from '../../assets/icons/common/homeIcon.png';
import homeIconActive from '../../assets/icons/common/homeIcon_active.png';
import expertIcon from '../../assets/icons/common/expertIcon.png';
import expertIconActive from '../../assets/icons/common/expertIcon_active.png';
import megazineIcon from '../../assets/icons/common/megazineIcon.png';
import megazineIconActive from '../../assets/icons/common/megazineIcon_active.png';
import communityIcon from '../../assets/icons/common/communityIcon.png';
import communityIconActive from '../../assets/icons/common/communityIcon_active.png';
import userIcon from '../../assets/icons/common/userIcon.png';
import userIconActive from '../../assets/icons/common/userIcon_active.png';

export default function BottomNavigation() {
  const navItems = [
    {
      id: 'home',
      label: '홈',
      path: '/',
      icon: homeIcon,
      activeIcon: homeIconActive,
    },
    {
      id: 'expert',
      label: '전문가',
      path: '/expert',
      icon: expertIcon,
      activeIcon: expertIconActive,
    },
    {
      id: 'megazine',
      label: '매거진',
      path: '/megazine',
      icon: megazineIcon,
      activeIcon: megazineIconActive,
    },
    {
      id: 'community',
      label: '커뮤니티',
      path: '/community',
      icon: communityIcon,
      activeIcon: communityIconActive,
    },
    {
      id: 'mypage',
      label: '마이페이지',
      path: '/mypage',
      icon: userIcon,
      activeIcon: userIconActive,
    },
  ];

  return (
    <div className="flex justify-center items-center mt-20">
      <div className="bg-[#FFFFFF] fixed bottom-0 flex gap-4 border rounded-t-xl justify-between">
        {navItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            className="flex items-center justify-center p-5"
          >
            {({ isActive }) => (
              <img
                className="w-6"
                src={isActive ? item.activeIcon : item.icon}
                alt={item.label}
              />
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
