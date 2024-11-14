import React, { useState } from 'react';

const SearchBar = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    // Pass the search term back to CarList for filtering
    onSearchResults(searchTerm);
  };

  return (
    <div className="flex justify-center mt-6 items-center mb-6">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search cars..."
        className="px-4 py-2 border border-gray-300 w-[500px] outline-none rounded-lg"
      />
      <button
        onClick={handleSearch}
        className="ml-4 bg-black font-medium text-white px-4 py-2 rounded-lg"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
