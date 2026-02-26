// src/features/ui/slice/uiSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// src/features/ui/slice/uiSlice.ts - UPDATE UserRole type
export type UserRole = 
  | "admin" 
  | "local_business" 
  | "diaspora_investor" 
  | "user"  // ✅ ADD THIS
  | null;

interface UIState {
  sidebar: {
    adminOpen: boolean;
    businessOpen: boolean;
    investorOpen: boolean;
    mobileOpen: boolean;
    collapsed: boolean;
  };
  theme: "light" | "dark";
  loading: {
    [key: string]: boolean;
  };
  modals: {
    [key: string]: {
      isOpen: boolean;
      data?: any;
    };
  };
  toasts: Array<{
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
    duration?: number;
  }>;
  activeRole: UserRole;
}

// Get stored role or default to null
const getStoredRole = (): UserRole => {
  const role = localStorage.getItem("activeRole") as UserRole;
  return role || null;
};

// Initialize sidebar based on stored role - ONLY ONE will be true
const getInitialSidebarState = () => {
  const role = getStoredRole();

  // Start with all false
  const state = {
    adminOpen: false,
    businessOpen: false,
    investorOpen: false,
    mobileOpen: localStorage.getItem("mobileSidebarOpen") === "true" || false,
    collapsed: localStorage.getItem("sidebarCollapsed") === "true" || false,
  };

  // Set ONLY the one matching the role
  if (role === "admin") {
    state.adminOpen = true;
  } else if (role === "local_business") {
    state.businessOpen = true;
  } else if (role === "diaspora_investor") {
    state.investorOpen = true;
  }

  // Ensure localStorage matches (clean up any old/stale values)
  if (role !== "admin") localStorage.removeItem("adminSidebarOpen");
  if (role !== "local_business") localStorage.removeItem("businessSidebarOpen");
  if (role !== "diaspora_investor")
    localStorage.removeItem("investorSidebarOpen");

  // Set the correct one
  if (role === "admin") localStorage.setItem("adminSidebarOpen", "true");
  if (role === "local_business")
    localStorage.setItem("businessSidebarOpen", "true");
  if (role === "diaspora_investor")
    localStorage.setItem("investorSidebarOpen", "true");

  return state;
};

const initialState: UIState = {
  sidebar: getInitialSidebarState(),
  theme: (localStorage.getItem("theme") as "light" | "dark") || "dark",
  loading: {},
  modals: {},
  toasts: [],
  activeRole: getStoredRole(),
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarByRole: (state, action: PayloadAction<UserRole>) => {
      const role = action.payload;
      state.activeRole = role;
      localStorage.setItem("activeRole", role || "");

      // Reset all sidebar states to false
      state.sidebar.adminOpen = false;
      state.sidebar.businessOpen = false;
      state.sidebar.investorOpen = false;

      // Remove all from localStorage first
      localStorage.removeItem("adminSidebarOpen");
      localStorage.removeItem("businessSidebarOpen");
      localStorage.removeItem("investorSidebarOpen");

      // Set only the one for this role
      if (role === "admin") {
        state.sidebar.adminOpen = true;
        localStorage.setItem("adminSidebarOpen", "true");
      } else if (role === "local_business") {
        state.sidebar.businessOpen = true;
        localStorage.setItem("businessSidebarOpen", "true");
      } else if (role === "diaspora_investor") {
        state.sidebar.investorOpen = true;
        localStorage.setItem("investorSidebarOpen", "true");
      }
    },

    toggleSidebar: (state) => {
      state.sidebar.collapsed = !state.sidebar.collapsed;
      localStorage.setItem("sidebarCollapsed", String(state.sidebar.collapsed));
    },

    toggleMobileSidebar: (state) => {
      state.sidebar.mobileOpen = !state.sidebar.mobileOpen;
      localStorage.setItem(
        "mobileSidebarOpen",
        String(state.sidebar.mobileOpen),
      );
    },

    closeMobileSidebar: (state) => {
      state.sidebar.mobileOpen = false;
      localStorage.setItem("mobileSidebarOpen", "false");
    },

    clearAllSidebars: (state) => {
      state.sidebar.adminOpen = false;
      state.sidebar.businessOpen = false;
      state.sidebar.investorOpen = false;
      state.sidebar.mobileOpen = false;
      state.activeRole = null;

      localStorage.removeItem("adminSidebarOpen");
      localStorage.removeItem("businessSidebarOpen");
      localStorage.removeItem("investorSidebarOpen");
      localStorage.removeItem("mobileSidebarOpen");
      localStorage.removeItem("activeRole");
      localStorage.removeItem("sidebarCollapsed");
    },

    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.theme);
    },

    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },

    setLoading: (
      state,
      action: PayloadAction<{ key: string; isLoading: boolean }>,
    ) => {
      state.loading[action.payload.key] = action.payload.isLoading;
    },

    openModal: (
      state,
      action: PayloadAction<{ modal: string; data?: any }>,
    ) => {
      state.modals[action.payload.modal] = {
        isOpen: true,
        data: action.payload.data,
      };
    },

    closeModal: (state, action: PayloadAction<string>) => {
      if (state.modals[action.payload]) {
        state.modals[action.payload].isOpen = false;
      }
    },

    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key].isOpen = false;
      });
    },

    addToast: (
      state,
      action: PayloadAction<{
        type: "success" | "error" | "info" | "warning";
        message: string;
        duration?: number;
      }>,
    ) => {
      const id = Date.now().toString();
      state.toasts.push({
        id,
        ...action.payload,
        duration: action.payload.duration || 5000,
      });
    },

    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload,
      );
    },

    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const {
  setSidebarByRole,
  toggleSidebar,
  toggleMobileSidebar,
  closeMobileSidebar,
  clearAllSidebars,
  toggleTheme,
  setTheme,
  setLoading,
  openModal,
  closeModal,
  closeAllModals,
  addToast,
  removeToast,
  clearToasts,
} = uiSlice.actions;

export default uiSlice.reducer;
