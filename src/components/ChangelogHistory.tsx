
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import PricesTable from './PricesTable';
import RestrictionsTable from './RestrictionsTable';

const ChangelogHistory = () => {
  const [activeTab, setActiveTab] = useState('prices');

  const handleExport = (type: 'prices' | 'restrictions') => {
    // Export functionality - would integrate with actual data export
    console.log(`Exporting ${type} data to XLSX`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200">
            <TabsList className="h-12 p-0 bg-transparent rounded-none w-full justify-start">
              <TabsTrigger
                value="prices"
                className="h-12 px-8 rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF732D] data-[state=active]:bg-[#FF732D] data-[state=active]:text-white bg-transparent text-gray-600 hover:text-[#FF732D] hover:bg-gray-50 font-medium"
              >
                PRICES
              </TabsTrigger>
              <TabsTrigger
                value="restrictions"
                className="h-12 px-8 rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF732D] data-[state=active]:bg-[#FF732D] data-[state=active]:text-white bg-transparent text-gray-600 hover:text-[#FF732D] hover:bg-gray-50 font-medium"
              >
                RESTRICTIONS
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="prices" className="p-0 mt-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Prices History</h2>
                <Button
                  onClick={() => handleExport('prices')}
                  className="bg-[#FF732D] hover:bg-[#E5652A] text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export XLSX
                </Button>
              </div>
              <PricesTable />
            </div>
          </TabsContent>

          <TabsContent value="restrictions" className="p-0 mt-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Restrictions History</h2>
                <Button
                  onClick={() => handleExport('restrictions')}
                  className="bg-[#FF732D] hover:bg-[#E5652A] text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export XLSX
                </Button>
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
