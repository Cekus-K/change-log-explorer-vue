
import ChangelogHistory from "@/components/ChangelogHistory";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Changelog History
        </h1>
        <ChangelogHistory />
      </div>
    </div>
  );
};

export default Index;
