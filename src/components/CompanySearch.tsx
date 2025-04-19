"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { WikidataCompany } from "@/types/company";

interface CompanySearchProps {
  onCompanySelect: (companyId: string, companyName: string) => void;
}

export default function CompanySearch({ onCompanySelect }: CompanySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<WikidataCompany[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/companySearch?query=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        fetchSuggestions();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectCompany(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSelectCompany = (company: WikidataCompany) => {
    onCompanySelect(company.id, company.label);
    setSearchTerm(company.label);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <div className="company-search relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.trim().length >= 2 && setSuggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Unternehmen suchen..."
          className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          aria-label="Unternehmen suchen"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-t-2 border-primary rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-gray-800 shadow-lg"
        >
          <ul className="py-1">
            {suggestions.map((company, index) => (
              <li 
                key={company.id}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-700 ${
                  index === selectedIndex ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleSelectCompany(company)}
              >
                <div className="font-medium">{company.label}</div>
                {company.description && (
                  <div className="text-xs text-gray-400 mt-0.5">{company.description}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
