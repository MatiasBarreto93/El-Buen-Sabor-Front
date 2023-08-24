import React, {useCallback, useMemo, useState} from 'react';

type SearchContextProps = {
    searchTerm: string;
    updateSearchTerm: (newSearchTerm: string) => void;
};

export function useSearch() {
    const context = React.useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}

export const SearchContext = React.createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [searchTerm, setSearchTerm] = useState('');

    const updateSearchTerm = useCallback((newSearchTerm: string) => {
        setSearchTerm(newSearchTerm);
    }, []);

    const value = useMemo(() => ({ searchTerm, updateSearchTerm }), [searchTerm, updateSearchTerm]);

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};
