import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import PricesTable from '@/components/PricesTable';
import RestrictionsTable from '@/components/RestrictionsTable';
import Changelog from '@/components/Changelog';
import ChangelogHistory from '@/components/ChangelogHistory';

const Index = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>(['rates', 'restrictions']);

  const handleFiltersChange = (newFilters: string[]) => {
    // Ensure at least one filter is always selected
    if (newFilters.length === 0) {
      // If trying to deselect all, keep the current selection
      return;
    }
    
    // If only one filter is currently selected and user tries to deselect it
    if (activeFilters.length === 1 && newFilters.length === 0) {
      return;
    }
    
    setActiveFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hotel Revenue Management</h1>
        
        <Tabs defaultValue="pricing" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pricing" className="space-y-6">
            <PricesTable />
          </TabsContent>
          
          <TabsContent value="restrictions" className="space-y-6">
            <RestrictionsTable />
          </TabsContent>
          
          <TabsContent value="changelog" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Changelog</h2>
                <ToggleGroup 
                  type="multiple" 
                  value={activeFilters}
                  onValueChange={handleFiltersChange}
                  className="border rounded-lg p-1"
                >
                  <ToggleGroupItem 
                    value="rates" 
                    className="data-[state=on]:bg-[#FF732D] data-[state=on]:text-white px-4 py-2"
                  >
                    RATES
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="restrictions" 
                    className="data-[state=on]:bg-[#FF732D] data-[state=on]:text-white px-4 py-2"
                  >
                    RESTRICTIONS
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <Changelog 
                activeFilters={activeFilters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <ChangelogHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
