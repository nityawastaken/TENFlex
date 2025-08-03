import { useState, useCallback, useEffect } from 'react';

const API_KEY = '2LcsGseCB3331noCWvHsftZUrKitKdVb';
const API_URL = 'https://api.apilayer.com/skills';

export const useCategoriesAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const searchCategories = useCallback(async (query) => {
    console.log('searchCategories called with query:', query);
    // If input is empty, return empty array
    if (!query || query.trim().length === 0) {
      console.log('Empty query, returning empty array');
      setSearchResults([]);
      return [];
    }
    setLoading(true);
    setError(null);

    try {
      // Fetch from API
      console.log('Fetching from API for query:', query);
      const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&&count=10`, {
        method: 'GET',
        headers: {
          'apikey': API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const categories = await response.json();
      console.log('API response:', categories);
      
      // Format API results
      const formattedCategories = categories.map(category => ({ value: category, label: category }));
      console.log('Formatted categories:', formattedCategories);

      setSearchResults(formattedCategories);
      return formattedCategories;
    } catch (err) {
      setError(err.message);
      console.error('Categories API error:', err);
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial categories with default keyword "A"
  useEffect(() => {
    const loadInitialCategories = async () => {
      console.log('Loading initial categories with keyword "A"');
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}?q=A&&count=10`, {
          method: 'GET',
          headers: {
            'apikey': API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const categories = await response.json();
        console.log('Initial API response:', categories);
        
        const formattedCategories = categories.map(category => ({ value: category, label: category }));
        console.log('Initial formatted categories:', formattedCategories);
        
        setSearchResults(formattedCategories);
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to load initial categories:', err);
        setError(err.message);
        setSearchResults([]);
        setIsInitialized(true);
      } finally {
        setLoading(false);
      }
    };

    loadInitialCategories();
  }, []);

  // Handle input change without triggering API call
  const handleInputChange = useCallback((newValue) => {
    console.log('Input changed to:', newValue);
    setInputValue(newValue);
    return newValue;
  }, []);

  // Handle key down event - search only when Enter is pressed
  const handleKeyDown = useCallback((event) => {
    console.log('Key pressed:', event.key);
    if (event.key === 'Enter' && inputValue.trim().length > 0) {
      console.log('Enter pressed, searching for:', inputValue);
      event.preventDefault();
      searchCategories(inputValue);
    }
  }, [inputValue, searchCategories]);

  // Function to use with AsyncPaginate component
  const loadOptions = useCallback(async (inputValue, { page }) => {
    console.log('loadOptions called with:', inputValue, page);
    console.log('Current search results:', searchResults);
    
    // Return current search results without making a new API call
    const options = searchResults || [];
    console.log('Returning options:', options);
    return {
      options: options,
      hasMore: false,
    };
  }, [searchResults]);

  return {
    searchCategories,
    loadOptions,
    loading,
    error,
    handleInputChange,
    handleKeyDown,
    inputValue,
    isInitialized
  };
}; 