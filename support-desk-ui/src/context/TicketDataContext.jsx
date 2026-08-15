import { createContext, useContext, useReducer, useCallback } from 'react';

// Cache key helper function
export function getCacheKey(pageInfo, filters) {
  const { page, size, sortBy, direction } = pageInfo;
  const { searchText = '', status = 'ALL' } = filters || {};
  return `${page}|${size}|${sortBy}|${direction}|${searchText}|${status}`;
}

// 1. Initial State (Includes cache and data source)
const initialState = {
  tickets: [],
  selectedTicketId: null,
  loading: false,
  error: null,
  source: null, // 'backend' | 'cache'
  cache: {},    // Store key -> response mapping
  pageInfo: {
    page: 0,
    size: 10,
    totalPages: 1,
    totalElements: 0,
    sortBy: 'createdAt',
    direction: 'desc',
  },
  filters: {
    searchText: '',
    status: 'ALL',
  },
};

// 2. Action Constants
export const TICKET_ACTIONS = {
  LOAD_START: 'LOAD_START',
  LOAD_SUCCESS: 'LOAD_SUCCESS',
  LOAD_FROM_CACHE: 'LOAD_FROM_CACHE',
  LOAD_ERROR: 'LOAD_ERROR',
  SET_SEARCH_TEXT: 'SET_SEARCH_TEXT',
  SET_STATUS_FILTER: 'SET_STATUS_FILTER',
  SET_PAGE: 'SET_PAGE',
  SET_PAGE_SIZE: 'SET_PAGE_SIZE',
  SET_SORT: 'SET_SORT',
  SELECT_TICKET: 'SELECT_TICKET',
  CLEAR_CACHE: 'CLEAR_CACHE',
};

// Helper function to extract normalized tickets and pagination metadata
function parseBackendPayload(payload, currentState) {
  const isArray = Array.isArray(payload);
  const data = payload || {};
  const tickets = isArray ? payload : data.content || data.tickets || data.data || [];

  const rawPage = data.number ?? data.pageable?.pageNumber ?? data.page?.number;
  const safePage = typeof rawPage === 'number' ? rawPage : currentState.pageInfo.page;

  const rawSize = data.size ?? data.pageable?.pageSize ?? data.page?.size;
  const safeSize = typeof rawSize === 'number' ? rawSize : currentState.pageInfo.size;

  const rawTotalPages = data.totalPages ?? data.page?.totalPages;
  const safeTotalPages = typeof rawTotalPages === 'number' ? rawTotalPages : 1;

  const rawTotalElements = data.totalElements ?? data.page?.totalElements;
  const safeTotalElements = typeof rawTotalElements === 'number' ? rawTotalElements : tickets.length;

  return {
    tickets,
    pageInfo: {
      ...currentState.pageInfo,
      page: safePage,
      size: safeSize,
      totalPages: safeTotalPages,
      totalElements: safeTotalElements,
    },
  };
}

// 3. Reducer Function
function ticketDataReducer(state, action) {
  switch (action.type) {
    case TICKET_ACTIONS.LOAD_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // Cache Miss (Fetched from Backend -> Save to Cache)
    case TICKET_ACTIONS.LOAD_SUCCESS: {
      const { data, cacheKey } = action.payload;
      const parsed = parseBackendPayload(data, state);

      return {
        ...state,
        loading: false,
        tickets: parsed.tickets,
        pageInfo: parsed.pageInfo,
        source: 'backend',
        cache: cacheKey ? { ...state.cache, [cacheKey]: data } : state.cache,
        error: null,
      };
    }

    // Cache Hit (Restored directly from memory cache)
    case TICKET_ACTIONS.LOAD_FROM_CACHE: {
      const cacheKey = action.payload;
      const cachedData = state.cache[cacheKey];

      if (!cachedData) return state;

      const parsed = parseBackendPayload(cachedData, state);

      return {
        ...state,
        loading: false,
        tickets: parsed.tickets,
        pageInfo: parsed.pageInfo,
        source: 'cache',
        error: null,
      };
    }

    case TICKET_ACTIONS.LOAD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case TICKET_ACTIONS.SET_SEARCH_TEXT:
      return {
        ...state,
        pageInfo: { ...state.pageInfo, page: 0 },
        filters: { ...state.filters, searchText: action.payload },
      };

    case TICKET_ACTIONS.SET_STATUS_FILTER:
      return {
        ...state,
        pageInfo: { ...state.pageInfo, page: 0 },
        filters: { ...state.filters, status: action.payload },
      };

    case TICKET_ACTIONS.SET_PAGE: {
      const safePage = typeof action.payload === 'number' ? action.payload : Number(action.payload) || 0;
      return {
        ...state,
        pageInfo: { ...state.pageInfo, page: safePage },
      };
    }

    case TICKET_ACTIONS.SET_PAGE_SIZE:
      return {
        ...state,
        pageInfo: {
          ...state.pageInfo,
          size: Number(action.payload) || 10,
          page: 0,
        },
      };

    case TICKET_ACTIONS.SET_SORT:
      return {
        ...state,
        pageInfo: {
          ...state.pageInfo,
          sortBy: action.payload.sortBy ?? state.pageInfo.sortBy,
          direction: action.payload.direction ?? state.pageInfo.direction,
          page: 0,
        },
      };

    case TICKET_ACTIONS.SELECT_TICKET:
      return {
        ...state,
        selectedTicketId: action.payload,
      };

    case TICKET_ACTIONS.CLEAR_CACHE:
      return {
        ...state,
        cache: {},
      };

    default:
      return state;
  }
}

// 4. Create Context
const TicketDataContext = createContext(null);

// 5. Context Provider Component
export function TicketDataProvider({ children }) {
  const [state, dispatch] = useReducer(ticketDataReducer, initialState);

  const loadStart = useCallback(() => {
    dispatch({ type: TICKET_ACTIONS.LOAD_START });
  }, []);

  const loadSuccess = useCallback((data, cacheKey) => {
    dispatch({ type: TICKET_ACTIONS.LOAD_SUCCESS, payload: { data, cacheKey } });
  }, []);

  const loadFromCache = useCallback((cacheKey) => {
    dispatch({ type: TICKET_ACTIONS.LOAD_FROM_CACHE, payload: cacheKey });
  }, []);

  const loadError = useCallback((error) => {
    dispatch({ type: TICKET_ACTIONS.LOAD_ERROR, payload: error });
  }, []);

  const setSearchText = useCallback((searchText) => {
    dispatch({ type: TICKET_ACTIONS.SET_SEARCH_TEXT, payload: searchText });
  }, []);

  const setStatusFilter = useCallback((status) => {
    dispatch({ type: TICKET_ACTIONS.SET_STATUS_FILTER, payload: status });
  }, []);

  const setPage = useCallback((page) => {
    const safePage = typeof page === 'number' ? page : Number(page) || 0;
    dispatch({ type: TICKET_ACTIONS.SET_PAGE, payload: safePage });
  }, []);

  const setPageSize = useCallback((size) => {
    dispatch({ type: TICKET_ACTIONS.SET_PAGE_SIZE, payload: Number(size) });
  }, []);

  const setSort = useCallback((sortBy, direction) => {
    dispatch({ type: TICKET_ACTIONS.SET_SORT, payload: { sortBy, direction } });
  }, []);

  const selectTicket = useCallback((ticketId) => {
    dispatch({ type: TICKET_ACTIONS.SELECT_TICKET, payload: ticketId });
  }, []);

  const clearCache = useCallback(() => {
    dispatch({ type: TICKET_ACTIONS.CLEAR_CACHE });
  }, []);

  const value = {
    tickets: state.tickets,
    selectedTicketId: state.selectedTicketId,
    loading: state.loading,
    error: state.error,
    source: state.source,
    cache: state.cache,
    pageInfo: state.pageInfo,
    filters: state.filters,
    dispatch,
    loadStart,
    loadSuccess,
    loadFromCache,
    loadError,
    setSearchText,
    setStatusFilter,
    setPage,
    setPageSize,
    setSort,
    selectTicket,
    clearCache,
  };

  return (
    <TicketDataContext.Provider value={value}>
      {children}
    </TicketDataContext.Provider>
  );
}

// 6. Custom Hook
export function useTicketData() {
  const context = useContext(TicketDataContext);
  if (!context) {
    throw new Error('useTicketData must be used within a TicketDataProvider');
  }
  return context;
}