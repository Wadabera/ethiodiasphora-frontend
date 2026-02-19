import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import type {
  Company,
  RegisterCompanyDto,
  UpdateCompanyDto,
} from "../types/company.types";

interface CompanyState {
  myCompanies: Company[];
  myCompany: Company | null;
  loading: boolean;
  registering: boolean;
  updating: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CompanyState = {
  myCompanies: [],
  myCompany: null,
  loading: false,
  registering: false,
  updating: false,
  error: null,
  success: false,
};

// 1️⃣ REGISTER COMPANY
export const registerCompany = createAsyncThunk(
  "companies/register",
  async (companyData: RegisterCompanyDto, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/v1/companies/register", companyData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to register company"
      );
    }
  }
);

// 2️⃣ GET MY COMPANIES - ✅ CORRECT ENDPOINT
export const fetchMyCompanies = createAsyncThunk(
  "companies/fetchMyCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/v1/companies/my-companies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("API Response:", response.data); // Debug log
      
      // ✅ Handle the response structure { total, companies }
      return response.data;
    } catch (error: any) {
      console.error("Fetch companies error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch companies"
      );
    }
  }
);

// 3️⃣ GET SINGLE COMPANY
export const fetchCompanyById = createAsyncThunk(
  "companies/fetchCompanyById",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/api/v1/companies/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company"
      );
    }
  }
);

// 4️⃣ UPDATE COMPANY
export const updateCompany = createAsyncThunk(
  "companies/update",
  async (
    { id, data }: { id: string; data: UpdateCompanyDto },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/api/v1/companies/my-company/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update company"
      );
    }
  }
);

const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    clearCompanyError: (state) => {
      state.error = null;
    },
    resetCompanySuccess: (state) => {
      state.success = false;
    },
    clearMyCompanies: (state) => {
      state.myCompanies = [];
      state.myCompany = null;
    },
    setCurrentCompany: (state, action) => {
      state.myCompany = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Company
      .addCase(registerCompany.pending, (state) => {
        state.registering = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.registering = false;
        state.myCompanies = [action.payload, ...state.myCompanies];
        state.myCompany = action.payload;
        state.success = true;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.registering = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // ✅ Fetch My Companies - FIXED
      .addCase(fetchMyCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCompanies.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Store the entire companies array
        state.myCompanies = action.payload.companies || [];
        // ✅ Set first company as current by default
        state.myCompany = action.payload.companies?.[0] || null;
      })
      .addCase(fetchMyCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.myCompanies = [];
        state.myCompany = null;
      })
      
      // Fetch Single Company
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.myCompany = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Company
      .addCase(updateCompany.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.updating = false;
        // Update in companies array
        const index = state.myCompanies.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.myCompanies[index] = action.payload;
        }
        // Update current company
        if (state.myCompany?._id === action.payload._id) {
          state.myCompany = action.payload;
        }
        state.success = true;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { 
  clearCompanyError, 
  resetCompanySuccess, 
  clearMyCompanies, 
  setCurrentCompany 
} = companySlice.actions;
export default companySlice.reducer;