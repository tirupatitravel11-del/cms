import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SubMenuItem {
  label: string;
  path: string;
  permission: string | null;
  icon: React.ComponentType<any>;
}

interface MenuItem {
  label: string;
  path: string;
  permission: string | null;
  icon: React.ComponentType<any>;
  subMenu?: SubMenuItem | SubMenuItem[];
}

interface SidebarItemProps {
  item: MenuItem;
  isExpanded: boolean;
  onToggleExpanded: (label: string) => void;
  currentPath: string;
  hasPermission: (permission: string | null) => boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isExpanded,
  onToggleExpanded,
  currentPath,
  hasPermission,
}) => {
  const IconComponent = item.icon;
  const hasSubMenu = item.subMenu !== undefined;
  const isActive = currentPath === item.path;

  // Normalize submenu to always be an array
  const subMenuItems = hasSubMenu 
    ? Array.isArray(item.subMenu) 
      ? item.subMenu 
      : [item.subMenu!]
    : [];

  const filteredSubMenuItems = subMenuItems.filter(subItem => hasPermission(subItem.permission));

  const handleClick = () => {
    if (hasSubMenu) {
      onToggleExpanded(item.label);
    } else {
      // Handle navigation here
      // console.log(`Navigate to ${item.path}`);
    }
  };

  const handleSubItemClick = (path: string) => {
    // console.log(`Navigate to ${path}`);
  };

  return (
    <div className="space-y-1">
      {/* Main Item */}
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg
          transition-all duration-200 ease-in-out group
          ${isActive 
            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
      >
        <div className="flex items-center space-x-3">
          <IconComponent 
            className={`
              w-5 h-5 transition-colors duration-200
              ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}
            `} 
          />
          <span className="text-sm font-medium">{item.label}</span>
        </div>
        
        {hasSubMenu && (
          <div className="flex-shrink-0 ml-2">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            )}
          </div>
        )}
      </button>

      {/* Sub Menu */}
      {hasSubMenu && isExpanded && (
        <div className="ml-8 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {filteredSubMenuItems.map((subItem, index) => {
            const SubIconComponent = subItem.icon;
            const isSubActive = currentPath === subItem.path;
            
            return (
              <button
                key={`${subItem.label}-${index}`}
                onClick={() => handleSubItemClick(subItem.path)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md
                  transition-all duration-200 ease-in-out group
                  ${isSubActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <SubIconComponent 
                  className={`
                    w-4 h-4 transition-colors duration-200
                    ${isSubActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                  `} 
                />
                <span className="text-sm">{subItem.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};