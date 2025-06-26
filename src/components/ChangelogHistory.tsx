
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import PricesTable from './PricesTable';
import RestrictionsTable from './RestrictionsTable';
import Changelog from './Changelog';

const ChangelogHistory = () => {
  const [activeTab, setActiveTab] = useState('prices');
  const [showChangelog, setShowChangelog] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="border-b border-gray-200 bg-gray-50/50 rounded-t-xl">
          <div className="flex justify-between items-center px-6 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="h-14 p-0 bg-transparent rounded-none w-full justify-start">
                <TabsTrigger
                  value="prices"
                  className="h-14 px-8 rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF732D] data-[state=active]:bg-[#FF732D] data-[state=active]:text-white bg-transparent text-gray-600 hover:text-[#FF732D] hover:bg-gray-100/50 font-semibold text-sm transition-all duration-200"
                >
                  PRICES
                </TabsTrigger>
                <TabsTrigger
                  value="restrictions"
                  className="h-14 px-8 rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF732D] data-[state=active]:bg-[#FF732D] data-[state=active]:text-white bg-transparent text-gray-600 hover:text-[#FF732D] hover:bg-gray-100/50 font-semibold text-sm transition-all duration-200"
                >
                  RESTRICTIONS
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button
              onClick={() => setShowChangelog(!showChangelog)}
              className="bg-[#FF732D] hover:bg-[#FF732D]/90 text-white font-medium px-4 py-2 rounded"
            >
              {showChangelog ? 'Show Changelog History' : 'Show Changelog'}
            </Button>
          </div>
        </div>

        {showChangelog ? (
          <div className="p-6">
            <Changelog />
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
