"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  AlertTriangle, 
  Mail, 
  Menu, 
  X, 
  Search, 
  Bell, 
  User,
  ChevronRight,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import styles from './AdminLayout.module.css';
import { usePathname, useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
    { name: 'Customers', icon: <Users size={20} />, path: '/admin/customers' },
    { name: 'Inventory', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Recovery Hub', icon: <AlertTriangle size={20} />, path: '/admin/recovery' },
    { name: 'Support Tickets', icon: <Mail size={20} />, path: '/admin/tickets' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div className={styles.mobileBackdrop} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <img src="/logo/logo.png" alt="Kalsa Foods" className={styles.logo} />
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.name}</span>
              {isActive(item.path) && <ChevronRight size={16} className={styles.activeChevron} />}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
           <div className={styles.footerItem}>
              <Settings size={18} />
              <span>Settings</span>
           </div>
           <div className={styles.footerItem}>
              <HelpCircle size={18} />
              <span>Help Center</span>
           </div>
           <div className={styles.footerItem} onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
              <LogOut size={18} />
              <span>Exit Admin</span>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        {/* Top Navbar */}
        <header className={styles.topNavbar}>
          <div className={styles.navbarLeft}>
            <button className={styles.mobileMenuBtn} onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className={styles.searchBar}>
              <Search size={18} color="#7f8ea3" />
              <input type="text" placeholder="Search orders, payments, tickets..." />
              <span className={styles.searchKbd}>⌘ K</span>
            </div>
          </div>

          <div className={styles.navbarRight}>
            <button className={styles.iconBtn}>
              <Bell size={20} />
              <span className={styles.notifBadge}></span>
            </button>
            <div className={styles.userProfile}>
               <div className={styles.userAvatar}>A</div>
               <div className={styles.userInfo}>
                  <p className={styles.userName}>Admin</p>
                  <p className={styles.userRole}>Store Manager</p>
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.pageContent}>
          <div className={styles.contentHeader}>
            <h2>{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
