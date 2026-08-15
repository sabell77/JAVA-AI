import { createContext, useContext, useReducer, useCallback } from 'react';

// 1. Initial State
const initialState = {
  tickets: [],
  selectedTicketId: null,
  loading: false,
  error: null,
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
  LOAD_ERROR: 'LOAD_ERROR',
  SET_SEARCH_TEXT: 'SET_SEARCH_TEXT',
  SET_STATUS_FILTER: 'SET_STATUS_FILTER',
  SET_PAGE: 'SET_PAGE',
  SET_PAGE_SIZE: 'SET_PAGE_SIZE',
  SET_SORT: 'SET_SORT',
  SELECT_TICKET: 'SELECT_TICKET',
};

// 3. Reducer Function
function ticketDataReducer(state, action) {
  switch (action.type) {
    case TICKET_ACTIONS.LOAD_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case TICKET_ACTIONS.LOAD_SUCCESS: {
      const isArray = Array.isArray(action.payload);
      const payload = action.payload || {};
      const tickets = isArray
        ? action.payload
        : payload.content || payload.tickets || payload.data || [];

      // 🛡️ Safely extract primitive page numbers (Spring Boot 3+ compatible)
      const rawPage = payload.number ?? payload.pageable?.pageNumber ?? payload.page?.number;
      const safePage = typeof rawPage === 'number' ? rawPage : state.pageInfo.page;

      const rawSize = payload.size ?? payload.pageable?.pageSize ?? payload.page?.size;
      const safeSize = typeof rawSize === 'number' ? rawSize : state.pageInfo.size;

      const rawTotalPages = payload.totalPages ?? payload.page?.totalPages;
      const safeTotalPages = typeof rawTotalPages === 'number' ? rawTotalPages : 1;

      const rawTotalElements = payload.totalElements ?? payload.page?.totalElements;
      const safeTotalElements = typeof rawTotalElements === 'number' ? rawTotalElements : tickets.length;

      return {
        ...state,
        loading: false,
        tickets,
        pageInfo: {
          ...state.pageInfo,
          page: safePage,
          size: safeSize,
          totalPages: safeTotalPages,
          totalElements: safeTotalElements,
        },
        error: null,
      };
    }

    case TICKET_ACTIONS.LOAD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Reset to page 0 whenever filter/search criteria changes
    case TICKET_ACTIONS.SET_SEARCH_TEXT:
      return {
        ...state,
        pageInfo: { ...state.pageInfo, page: 0 },
        filters: {
          ...state.filters,
          searchText: action.payload,
        },
      };

    case TICKET_ACTIONS.SET_STATUS_FILTER:
      return {
        ...state,
        pageInfo: { ...state.pageInfo, page: 0 },
        filters: {
          ...state.filters,
          status: action.payload,
        },
      };

    case TICKET_ACTIONS.SET_PAGE: {
      const safePage = typeof action.payload === 'number' ? action.payload : Number(action.payload) || 0;
      return {
        ...state,
        pageInfo: {
          ...state.pageInfo,
          page: safePage,
        },
      };
    }

    case TICKET_ACTIONS.SET_PAGE_SIZE:
      return {
        ...state,
        pageInfo: {
          ...state.pageInfo,
          size: Number(action.payload) || 10,
          page: 0, // Reset to first page when changing page size
        },
      };

    case TICKET_ACTIONS.SET_SORT:
      return {
        ...state,
        pageInfo: {
          ...state.pageInfo,
          sortBy: action.payload.sortBy ?? state.pageInfo.sortBy,
          direction: action.payload.direction ?? state.pageInfo.direction,
          page: 0, // Reset to first page when sorting changes
        },
      };

    case TICKET_ACTIONS.SELECT_TICKET:
      return {
        ...state,
        selectedTicketId: action.payload,
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

  const loadSuccess = useCallback((data) => {
    dispatch({ type: TICKET_ACTIONS.LOAD_SUCCESS, payload: data });
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

  const value = {
    tickets: state.tickets,
    selectedTicketId: state.selectedTicketId,
    loading: state.loading,
    error: state.error,
    pageInfo: state.pageInfo,
    filters: state.filters,
    dispatch,
    loadStart,
    loadSuccess,
    loadError,
    setSearchText,
    setStatusFilter,
    setPage,
    setPageSize,
    setSort,
    selectTicket,
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