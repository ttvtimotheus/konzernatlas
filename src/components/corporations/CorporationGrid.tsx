import React from 'react';
import { TOP_CORPORATIONS, CRITIQUE_MESSAGES } from '@/data/topCorporations';
import { useRouter } from 'next/navigation';

const getRandomCritique = () => {
  const randomIndex = Math.floor(Math.random() * CRITIQUE_MESSAGES.length);
  return CRITIQUE_MESSAGES[randomIndex];
};

export default function CorporationGrid() {
  const router = useRouter();
  const [hoveredMessage, setHoveredMessage] = React.useState<string>('');

  const handleCorporationSelect = (companyId: string) => {
    router.push(`/graph/${companyId}`);
  };

  return (
    <div className="container mx-auto px-4 py-10 fade-in">
      <h1 className="text-4xl font-bold mb-2 tracking-tight">Top-Konzerne</h1>
      <p className="text-lg mb-10 opacity-80">
        Die mächtigsten Unternehmen der Welt und ihre Verflechtungen.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {TOP_CORPORATIONS.map((company) => (
          <div
            key={company.id}
            className="bg-[#1c1c1e] border border-[#333] rounded-lg overflow-hidden 
                     cursor-pointer transition-all duration-300 transform hover:scale-[1.02] 
                     hover:shadow-lg hover:-translate-y-1"
            onClick={() => handleCorporationSelect(company.id)}
            onMouseEnter={() => setHoveredMessage(getRandomCritique())}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="text-4xl mb-4">{company.icon}</div>
              <h3 className="text-xl font-bold mb-1">{company.label}</h3>
              <p className="text-sm text-gray-400 mb-3">{company.category}</p>
              <p className="text-xs text-gray-500 mb-6 flex-grow">{company.description}</p>
              
              <div className="mt-auto">
                <span className="text-xs px-3 py-1 bg-[#ff3b30] bg-opacity-20 rounded-full text-[#ff3b30]">
                  Enthülle Netzwerk
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hoveredMessage && (
        <div className="fixed bottom-8 right-8 max-w-xs bg-[#1c1c1e] p-4 rounded-lg shadow-xl border-l-4 border-[#ff3b30] z-50 fade-in">
          <p className="italic text-sm">{hoveredMessage}</p>
        </div>
      )}
    </div>
  );
}
