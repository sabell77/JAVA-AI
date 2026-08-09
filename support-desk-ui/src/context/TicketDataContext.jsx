import { createContext, useContext, useReducer, useCallback } from 'react';

// 1. Initial State
const initialState = {
  tickets: [],
  selectedTicketId: null,
  loading: false,
  error: null,
  pageInfo: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalElements: 0,
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

    case TICKET_ACTIONS.LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        tickets: action.payload.tickets ?? action.payload,
        pageInfo: action.payload.pageInfo ?? state.pageInfo,
        error: null,
      };

    case TICKET_ACTIONS.LOAD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case TICKET_ACTIONS.SET_SEARCH_TEXT:
      return {
        ...state,
        filters: {
          ...state.filters,
          searchText: action.payload,
        },
      };

    case TICKET_ACTIONS.SET_STATUS_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          status: action.payload,
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

  // Helper action creators using useCallback
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

  const selectTicket = useCallback((ticketId) => {
    dispatch({ type: TICKET_ACTIONS.SELECT_TICKET, payload: ticketId });
  }, []);

  const value = {
    // State values
    tickets: state.tickets,
    selectedTicketId: state.selectedTicketId,
    loading: state.loading,
    error: state.error,
    pageInfo: state.pageInfo,
    filters: state.filters,

    // Raw dispatch (for custom actions)
    dispatch,

    // Action functions
    loadStart,
    loadSuccess,
    loadError,
    setSearchText,
    setStatusFilter,
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