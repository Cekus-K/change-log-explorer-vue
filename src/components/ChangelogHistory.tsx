
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import PricesTable from './PricesTable';
import RestrictionsTable from './RestrictionsTable';
import Changelog from './Changelog';

const ChangelogHistory = () => {
  const [activeTab, setActiveTab] = useState('prices');
  const [showChangelog, setShowChangelog] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(['rates', 'restrictions']);

  const handleTabClick = (tabValue: string) => {
    if (showChangelog) {
      // For Changelog: toggleable behavior
      if (tabValue === 'rates') {
        setActiveFilters(prev => 
          prev.includes('rates') 
            ? prev.filter(f => f !== 'rates')
            : [...prev, 'rates']
        );
      } else if (tabValue === 'restrictions') {
        setActiveFilters(prev => 
          prev.includes('restrictions') 
            ? prev.filter(f => f !== 'restrictions')
            : [...prev, 'restrictions']
        );
      }
    } else {
      // For Changelog History: alternating behavior
      setActiveTab(tabValue);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="border-b border-gray-200 bg-gray-50/50 rounded-t-xl">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex h-14">
              <div
                onClick={() => handleTabClick('rates')}
                className={`h-14 px-8 rounded-none border-b-2 border-transparent cursor-pointer font-semibold text-sm transition-all duration-200 flex items-center ${
                  (!showChangelog && activeTab === 'prices') || (showChangelog && activeFilters.includes('rates'))
                    ? 'border-[#FF732D] bg-[#FF732D] text-white'
                    : 'bg-transparent text-gray-600 hover:text-[#FF732D] hover:bg-gray-100/50'
                }`}
              >
                RATES
              </div>
              <div
                onClick={() => handleTabClick('restrictions')}
                className={`h-14 px-8 rounded-none border-b-2 border-transparent cursor-pointer font-semibold text-sm transition-all duration-200 flex items-center ${
                  (!showChangelog && activeTab === 'restrictions') || (showChangelog && activeFilters.includes('restrictions'))
                    ? 'border-[#FF732D] bg-[#FF732D] text-white'
                    : 'bg-transparent text-gray-600 hover:text-[#FF732D] hover:bg-gray-100/50'
                }`}
              >
                RESTRICTIONS
              </div>
            </div>
            
            <Button
              onClick={() => setShowChangelog(!showChangelog)}
              variant="ghost"
              className="text-[#FF732D] hover:text-[#FF732D]/90 hover:bg-[#FF732D]/10 font-medium px-4 py-2"
            >
              {showChangelog ? 'Show History' : 'Show Changelog'}
            </Button>
          </div>
        </div>

        {showChangelog ? (
          <div className="p-6">
            <Changelog activeFilters={activeFilters} />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="prices" className="p-0 mt-0">
              <div className="p-6">
                <PricesTable />
              </div>
            </TabsContent>

            <TabsContent value="restrictions" className="p-0 mt-0">
              <div className="p-6">
                <RestrictionsTable />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ChangelogHistory;
