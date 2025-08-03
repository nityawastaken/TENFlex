// Language utility functions for TENFlex
// This file provides centralized language code to name mapping

// Cache for language data to avoid repeated API calls
let languageCache = null;
let languageCachePromise = null;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch all languages from the backend
 * @returns {Promise<Array>} Array of language objects with code and name
 */
export const fetchAllLanguages = async () => {
  try {
    const response = await fetch(`${API_URL}/base/languages/`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to fetch languages');
    }
  } catch (error) {
    console.error('Error fetching languages:', error);
    // Return fallback languages if API fails
    return [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'fr', name: 'French' },
      { code: 'es', name: 'Spanish' },
      { code: 'de', name: 'German' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ar', name: 'Arabic' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'it', name: 'Italian' },
      { code: 'nl', name: 'Dutch' },
      { code: 'sv', name: 'Swedish' },
      { code: 'no', name: 'Norwegian' },
      { code: 'da', name: 'Danish' },
      { code: 'fi', name: 'Finnish' },
      { code: 'pl', name: 'Polish' },
      { code: 'tr', name: 'Turkish' },
      { code: 'he', name: 'Hebrew' },
      { code: 'th', name: 'Thai' },
      { code: 'vi', name: 'Vietnamese' },
      { code: 'id', name: 'Indonesian' },
      { code: 'ms', name: 'Malay' },
      { code: 'tl', name: 'Tagalog' },
      { code: 'bn', name: 'Bengali' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'mr', name: 'Marathi' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'kn', name: 'Kannada' },
      { code: 'ml', name: 'Malayalam' },
      { code: 'pa', name: 'Punjabi' },
      { code: 'or', name: 'Odia' },
      { code: 'as', name: 'Assamese' },
      { code: 'ne', name: 'Nepali' },
      { code: 'si', name: 'Sinhala' },
      { code: 'my', name: 'Burmese' },
      { code: 'km', name: 'Khmer' },
      { code: 'lo', name: 'Lao' },
      { code: 'mn', name: 'Mongolian' },
      { code: 'ka', name: 'Georgian' },
      { code: 'hy', name: 'Armenian' },
      { code: 'az', name: 'Azerbaijani' },
      { code: 'kk', name: 'Kazakh' },
      { code: 'ky', name: 'Kyrgyz' },
      { code: 'uz', name: 'Uzbek' },
      { code: 'tg', name: 'Tajik' },
      { code: 'tk', name: 'Turkmen' },
      { code: 'af', name: 'Afrikaans' },
      { code: 'zu', name: 'Zulu' },
      { code: 'xh', name: 'Xhosa' },
      { code: 'sw', name: 'Swahili' },
      { code: 'am', name: 'Amharic' },
      { code: 'ha', name: 'Hausa' },
      { code: 'yo', name: 'Yoruba' },
      { code: 'ig', name: 'Igbo' },
      { code: 'rw', name: 'Kinyarwanda' },
      { code: 'sn', name: 'Shona' },
      { code: 'st', name: 'Sesotho' },
      { code: 'tn', name: 'Tswana' },
      { code: 'ts', name: 'Tsonga' },
      { code: 've', name: 'Venda' },
      { code: 'ss', name: 'Swati' },
      { code: 'nd', name: 'Northern Ndebele' },
      { code: 'nr', name: 'Southern Ndebele' },
      { code: 'ny', name: 'Chichewa' },
      { code: 'mg', name: 'Malagasy' },
      { code: 'so', name: 'Somali' },
      { code: 'om', name: 'Oromo' },
      { code: 'ti', name: 'Tigrinya' },
      { code: 'aa', name: 'Afar' },
      { code: 'ab', name: 'Abkhazian' },
      { code: 'ak', name: 'Akan' },
      { code: 'an', name: 'Aragonese' },
      { code: 'av', name: 'Avaric' },
      { code: 'ay', name: 'Aymara' },
      { code: 'ba', name: 'Bashkir' },
      { code: 'be', name: 'Belarusian' },
      { code: 'bg', name: 'Bulgarian' },
      { code: 'bh', name: 'Bihari' },
      { code: 'bi', name: 'Bislama' },
      { code: 'bm', name: 'Bambara' },
      { code: 'bo', name: 'Tibetan' },
      { code: 'br', name: 'Breton' },
      { code: 'bs', name: 'Bosnian' },
      { code: 'ca', name: 'Catalan' },
      { code: 'ce', name: 'Chechen' },
      { code: 'ch', name: 'Chamorro' },
      { code: 'co', name: 'Corsican' },
      { code: 'cr', name: 'Cree' },
      { code: 'cs', name: 'Czech' },
      { code: 'cv', name: 'Chuvash' },
      { code: 'cy', name: 'Welsh' },
      { code: 'dv', name: 'Divehi' },
      { code: 'dz', name: 'Dzongkha' },
      { code: 'ee', name: 'Ewe' },
      { code: 'eo', name: 'Esperanto' },
      { code: 'et', name: 'Estonian' },
      { code: 'eu', name: 'Basque' },
      { code: 'fa', name: 'Persian' },
      { code: 'ff', name: 'Fulah' },
      { code: 'fo', name: 'Faroese' },
      { code: 'fy', name: 'Western Frisian' },
      { code: 'ga', name: 'Irish' },
      { code: 'gd', name: 'Scottish Gaelic' },
      { code: 'gl', name: 'Galician' },
      { code: 'gn', name: 'Guarani' },
      { code: 'gv', name: 'Manx' },
      { code: 'ht', name: 'Haitian' },
      { code: 'hu', name: 'Hungarian' },
      { code: 'ia', name: 'Interlingua' },
      { code: 'ie', name: 'Interlingue' },
      { code: 'ik', name: 'Inupiaq' },
      { code: 'io', name: 'Ido' },
      { code: 'is', name: 'Icelandic' },
      { code: 'iu', name: 'Inuktitut' },
      { code: 'jv', name: 'Javanese' },
      { code: 'ki', name: 'Kikuyu' },
      { code: 'kj', name: 'Kuanyama' },
      { code: 'ku', name: 'Kurdish' },
      { code: 'kv', name: 'Komi' },
      { code: 'kw', name: 'Cornish' },
      { code: 'lb', name: 'Luxembourgish' },
      { code: 'lg', name: 'Ganda' },
      { code: 'li', name: 'Limburgan' },
      { code: 'ln', name: 'Lingala' },
      { code: 'lt', name: 'Lithuanian' },
      { code: 'lu', name: 'Luba-Katanga' },
      { code: 'lv', name: 'Latvian' },
      { code: 'mh', name: 'Marshallese' },
      { code: 'mi', name: 'Maori' },
      { code: 'mk', name: 'Macedonian' },
      { code: 'mo', name: 'Moldavian' },
      { code: 'mt', name: 'Maltese' },
      { code: 'na', name: 'Nauru' },
      { code: 'nb', name: 'Norwegian Bokmål' },
      { code: 'nd', name: 'Northern Ndebele' },
      { code: 'ng', name: 'Ndonga' },
      { code: 'nn', name: 'Norwegian Nynorsk' },
      { code: 'nr', name: 'Southern Ndebele' },
      { code: 'nv', name: 'Navajo' },
      { code: 'oc', name: 'Occitan' },
      { code: 'oj', name: 'Ojibwa' },
      { code: 'os', name: 'Ossetian' },
      { code: 'pi', name: 'Pali' },
      { code: 'ps', name: 'Pushto' },
      { code: 'qu', name: 'Quechua' },
      { code: 'rm', name: 'Romansh' },
      { code: 'rn', name: 'Rundi' },
      { code: 'ro', name: 'Romanian' },
      { code: 'sa', name: 'Sanskrit' },
      { code: 'sc', name: 'Sardinian' },
      { code: 'sd', name: 'Sindhi' },
      { code: 'se', name: 'Northern Sami' },
      { code: 'sg', name: 'Sango' },
      { code: 'sk', name: 'Slovak' },
      { code: 'sl', name: 'Slovenian' },
      { code: 'sm', name: 'Samoan' },
      { code: 'sq', name: 'Albanian' },
      { code: 'sr', name: 'Serbian' },
      { code: 'su', name: 'Sundanese' },
      { code: 'wa', name: 'Walloon' },
      { code: 'wo', name: 'Wolof' },
      { code: 'yi', name: 'Yiddish' },
      { code: 'za', name: 'Zhuang' }
    ];
  }
};

/**
 * Get cached languages or fetch them if not cached
 * @returns {Promise<Array>} Array of language objects
 */
export const getLanguages = async () => {
  if (languageCache) {
    return languageCache;
  }
  
  if (languageCachePromise) {
    return languageCachePromise;
  }
  
  languageCachePromise = fetchAllLanguages().then(languages => {
    languageCache = languages;
    languageCachePromise = null;
    return languages;
  });
  
  return languageCachePromise;
};

/**
 * Convert language code to full name
 * @param {string} code - Language code (e.g., 'en', 'fr')
 * @returns {Promise<string>} Full language name or code if not found
 */
export const getLanguageName = async (code) => {
  if (!code) return '';
  
  const languages = await getLanguages();
  const language = languages.find(lang => lang.code === code);
  return language ? language.name : code;
};

/**
 * Convert multiple language codes to full names
 * @param {Array<string>} codes - Array of language codes
 * @returns {Promise<Array<string>>} Array of full language names
 */
export const getLanguageNames = async (codes) => {
  if (!codes || !Array.isArray(codes)) return [];
  
  const languages = await getLanguages();
  return codes.map(code => {
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code;
  });
};

/**
 * Convert language codes to language objects with code and name
 * @param {Array<string>} codes - Array of language codes
 * @returns {Promise<Array>} Array of language objects
 */
export const getLanguageObjects = async (codes) => {
  if (!codes || !Array.isArray(codes)) return [];
  
  const languages = await getLanguages();
  return codes.map(code => {
    const language = languages.find(lang => lang.code === code);
    return {
      code: code,
      name: language ? language.name : code
    };
  });
};

/**
 * Clear the language cache (useful for testing or refreshing data)
 */
export const clearLanguageCache = () => {
  languageCache = null;
  languageCachePromise = null;
}; 