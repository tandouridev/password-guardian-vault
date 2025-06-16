
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only add search parameter if we're on the main passwords page
    if (location.pathname === '/') {
      const searchParams = new URLSearchParams(location.search);
      if (query) {
        searchParams.set('q', query);
      } else {
        searchParams.delete('q');
      }
      navigate({ search: searchParams.toString() });
    } else {
      // If on another page, navigate to passwords page with search query
      navigate({ pathname: '/', search: query ? `?q=${encodeURIComponent(query)}` : '' });
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-3xl mx-auto">
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        size={18}
      />
      <Input
        type="search"
        placeholder="Search passwords"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-4 py-2 h-10 rounded-full bg-slate-100 border-none w-full"
      />
    </form>
  );
};

export default SearchBar;
