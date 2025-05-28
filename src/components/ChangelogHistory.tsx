
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PricesTable from './PricesTable';
import RestrictionsTable from './RestrictionsTable';

const ChangelogHistory = () => {
  const [activeTab, setActiveTab] = useState('prices');

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200 bg-gray-50/50 rounded-t-xl">
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
          </div>

          <TabsContent value="prices" className="p-0 mt-0">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Prices History</h2>
              </div>
              <PricesTable />
            </div>
          </TabsContent>

          <TabsContent value="restrictions" className="p-0 mt-0">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Restrictions History</h2>
              </div>
              <RestrictionsTable />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChangelogHistory;
