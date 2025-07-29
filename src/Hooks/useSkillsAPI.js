import { useState, useCallback } from 'react';

const API_KEY = '2LcsGseCB3331noCWvHsftZUrKitKdVb';
const API_URL = 'https://api.apilayer.com/skills';

export const useSkillsAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchSkills = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching skills for query:', query);
      const response = await fetch(`${API_URL}?q=${encodeURIComponent(query.trim())}`, {
        method: 'GET',
        headers: {
          'apikey': API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const skills = await response.json();
      console.log('Skills API response:', skills);
      
      // Convert the array of skill names to the format expected by react-select
      const formattedSkills = skills.map(skill => ({
        value: skill,
        label: skill
      }));

      return formattedSkills;
    } catch (err) {
      setError(err.message);
      console.error('Skills API error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to use with AsyncPaginate component
  const loadOptions = useCallback(async (inputValue, { page }) => {
    console.log('loadOptions called with:', inputValue, page);
    const options = await searchSkills(inputValue);
    return {
      options,
      hasMore: false,
    };
  }, [searchSkills]);

  return {
    searchSkills,
    loadOptions,
    loading,
    error
  };
}; 