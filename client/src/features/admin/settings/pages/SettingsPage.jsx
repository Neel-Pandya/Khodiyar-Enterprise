import React, { useState } from 'react';
import { User, Shield, Palette, Settings as SettingsIcon } from 'lucide-react';
import ProfileSettings from '../components/ProfileSettings';
import SecuritySettings from '../components/SecuritySettings';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User, component: ProfileSettings },
        { id: 'security', label: 'Security', icon: Shield, component: SecuritySettings },
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab).component;

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
            {/* Page Header */}
            <div className="px-4 md:px-0">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-1">
                    Account Settings
                </h1>
                <p className="text-slate-400 text-sm">
                    Manage your profile details and security settings
                </p>
            </div>

            {/* Settings Layout */}
            <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-0">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0">
                    <nav className="flex flex-col gap-2 p-1.5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap lg:whitespace-normal flex-1 lg:flex-none
                                        ${isActive 
                                            ? 'bg-[#1e3a5f] text-white shadow-lg shadow-[#1e3a5f]/20' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                                    `}
                                >
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <ActiveComponent />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
