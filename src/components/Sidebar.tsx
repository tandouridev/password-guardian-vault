
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { KeyRound, Home, Activity, FileText, Shield, Settings } from 'lucide-react';

const menu = [
  {
    name: 'Passwords',
    label: 'Passwords',
    href: '/',
    icon: Home,
  },
  {
    name: 'Security Analysis',
    label: 'Analysis',
    href: '/analysis',
    icon: Activity,
  },
  {
    name: 'Secure Notes',
    label: 'Notes',
    href: '/notes',
    icon: FileText,
  },
  {
    name: 'Security Checkup',
    label: 'Checkup',
    href: '/checkup',
    icon: Shield,
  },
  {
    name: 'Settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

function MobileNavBar({ items, activePath }: { items: typeof menu; activePath: string }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-around bg-white border-t border-gray-200 shadow-inner md:hidden">
      {items.slice(0, 4).map((item) => {
        const isActive = activePath === item.href;
        return (
          <NavLink
            key={item.name}
            to={item.href}
            className={cn(
              'flex flex-col items-center flex-1 py-2 transition-colors',
              isActive ? 'text-[#6E59A5]' : 'text-gray-400 hover:text-[#6E59A5]'
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive ? "stroke-2" : "stroke-1.5")} />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        );
      })}
      {/* Extra: a settings button on mobile nav */}
      <NavLink
        to="/settings"
        className={cn(
          'flex flex-col items-center flex-1 py-2 transition-colors',
          activePath === '/settings' ? 'text-[#6E59A5]' : 'text-gray-400 hover:text-[#6E59A5]'
        )}
      >
        <Settings className={cn("h-5 w-5", activePath === "/settings" ? "stroke-2" : "stroke-1.5")} />
        <span className="text-xs">Settings</span>
      </NavLink>
    </nav>
  )
}

const Sidebar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  // Only render sidebar on desktop and up
  if (isMobile) {
    // On mobile, show only bottom navbar, no sidebar or sidebar toggle icon
    return (
      <>
        <MobileNavBar items={menu} activePath={location.pathname} />
      </>
    );
  }

  // Render sidebar for desktop+
  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 flex flex-col transition-all duration-300 h-full shadow-lg',
          'w-72 bg-gradient-to-br from-[#D6BCFA] via-[#E5DEFF] to-[#FFF] border-r border-gray-200 min-h-screen',
          'hidden md:flex'
        )}
        aria-label="Sidebar"
      >
        {/* Header */}
        <div className="p-4 flex items-center h-16">
          <span className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-tr from-[#9b87f5] to-[#6E59A5] shadow-md">
            <KeyRound className="h-6 w-6 text-white" />
          </span>
          <span
            className="ml-3 font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#6E59A5] via-[#7E69AB] to-[#9b87f5] bg-clip-text text-transparent"
          >
            Password Guardian
          </span>
        </div>

        {/* Divider */}
        <div className="mx-3 mb-3 h-px bg-gray-200 opacity-60" />

        {/* Menu */}
        <nav className="flex-1">
          <ul className="flex flex-col gap-2 px-2">
            {menu.map((item) => {
              const active = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={cn(
                      'group flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200',
                      'hover:bg-[#e5deff]/80 hover:shadow-md hover:text-[#6E59A5]',
                      active ? 'bg-[#9b87f5]/20 ring-2 ring-[#9b87f5] text-[#6E59A5]' : 'text-gray-600'
                    )}
                  >
                    <span className="flex items-center justify-center">
                      <span
                        className={cn(
                          'inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors duration-200',
                          'group-hover:bg-[#f3f0ff] group-hover:text-[#7E69AB]',
                          'text-[#7E69AB] bg-transparent',
                          active ? 'bg-[#9b87f5] text-white' : ''
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </span>
                    </span>
                    <span className="ml-2">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer: collapse hint for desktop */}
        <div className="mt-auto mb-3 px-4 pb-4">
          <div className="rounded-md bg-[#F1F0FB] text-xs text-gray-500 px-3 py-2 text-center">
            <span>
              Press <span className="font-semibold">Ctrl/Cmd + B</span> to toggle sidebar
            </span>
          </div>
        </div>
      </aside>

      {/* Placeholder for sidebar space on desktop */}
      <div className="w-72 shrink-0 hidden md:block" aria-hidden />
    </>
  );
};

export default Sidebar;
