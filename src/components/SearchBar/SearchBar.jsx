import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiFileText, FiBriefcase } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await onSearch(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result) => {
    if (result.type === 'Application') {
      navigate('/my-applications', { 
        state: { openApplicationId: result.id }
      });
    } else if (result.type === 'Opportunity') {
      navigate('/new-opportunities', { 
        state: { openOpportunityId: result.id }
      });
    } else {
      navigate(result.link);
    }
    
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="relative" ref={searchRef}>
      <button 
        onClick={handleSearchClick}
        className="search-icon-button text-gray-600 hover:text-gray-800 p-2 rounded-full"
      >
        <FiSearch className="w-6 h-6" />
      </button>

      {isSearchOpen && (
        <div className="search-dropdown absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search applications and opportunities..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar-input w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            <div className="search-results-container mt-4">
              {isSearching ? (
                <div className="text-center py-4 text-gray-500">
                  Searching...
                </div>
              ) : searchQuery && searchResults.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No results found
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Search Results</h3>
                  <ul className="space-y-1">
                    {searchResults.map((result) => (
                      <li key={`${result.type}-${result.id}`}>
                        <button
                          onClick={() => handleResultClick(result)}
                          className="search-result-item w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2"
                        >
                          {result.icon === 'FiFileText' ? (
                            <FiFileText className={`w-4 h-4 ${
                              result.type === 'Application' ? 'text-blue-500' : 'text-gray-500'
                            }`} />
                          ) : (
                            <FiBriefcase className={`w-4 h-4 ${
                              result.type === 'Application' ? 'text-blue-500' : 'text-gray-500'
                            }`} />
                          )}
                          <div>
                            <span className="font-medium">{result.title}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {result.type}
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 rounded-b-lg">
            Press <kbd className="px-2 py-1 bg-white rounded shadow">↵</kbd> to search
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 