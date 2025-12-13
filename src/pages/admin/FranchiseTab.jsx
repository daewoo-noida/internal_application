import { useState } from 'react';
import FranchiseManager from './FranchiseManager';

const FranchiseTab = () => {
    const [activeTab, setActiveTab] = useState('master');

    const tabs = [
        { id: 'master', label: 'Master Franchises' },
        { id: 'ddp', label: 'DDP Franchises' },
        { id: 'signature', label: 'Signature Stores' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex flex-wrap gap-2 md:gap-0 md:space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 md:py-4 px-1 font-medium text-xs md:text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === 'master' && <FranchiseManager type="master" />}
                {activeTab === 'ddp' && <FranchiseManager type="ddp" />}
                {activeTab === 'signature' && <FranchiseManager type="signature" />}
            </div>
        </div>
    );
};

export default FranchiseTab;