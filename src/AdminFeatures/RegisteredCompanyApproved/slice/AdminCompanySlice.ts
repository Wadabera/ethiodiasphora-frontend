import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import type {
  Company,
  CompanyLicenseStatus,
  UpdateCompanyDto,
} from "../types/company.types";

interface AdminCompanyState {
  companies: Company[];
  filteredCompanies: Company[];
  selectedCompany: Company | null;
  fetchLoading: boolean;
  actionLoading: string | null;
  error: string | null;
  successMessage: string | null;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
  };
  filters: {
    status: string;
    businessType: string;
    search: string;
  };
}

const initialState: AdminCompanyState = {
  companies: [],
  filteredCompanies: [],
  selectedCompany: null,
  fetchLoading: false,
  actionLoading: null,
  error: null,
  successMessage: null,
  stats: {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    suspended: 0,
  },
  filters: {
    status: "all",
    businessType: "all",
    search: "",
  },
};

// Helper function to calculate stats
const calculateStats = (companies: Company[]) => {
  return {
    total: companies.length,
    pending: companies.filter((c) => c.licenseStatus === "pending").length,
    approved: companies.filter((c) => c.licenseStatus === "approved").length,
    rejected: companies.filter((c) => c.licenseStatus === "rejected").length,
    suspended: companies.filter((c) => c.licenseStatus === "suspended").length,
  };
};

// =================== ASYNC THUNKS ===================

// Fetch all companies
export const fetchAllCompanies = createAsyncThunk<
  Company[],
  void,
  { rejectValue: string }
>("adminCompanies/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/v1/companies/admin/all");
    return response.data.companies || response.data || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch companies",
    );
  }
});

// Fetch single company by ID
export const fetchCompanyById = createAsyncThunk<
  Company,
  string,
  { rejectValue: string }
>("adminCompanies/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/v1/companies/admin/${id}`);
    return response.data.company || response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch company",
    );
  }
});

// Approve Company
export const approveCompany = createAsyncThunk<
  Company,
  { id: string; notes?: string },
  { rejectValue: string }
>("adminCompanies/approve", async ({ id, notes }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/v1/companies/admin/${id}/approve`, {
      notes: notes || "Approved by admin",
    });
    return response.data.company || response.data.data || response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to approve company",
    );
  }
});

// Reject Company
export const rejectCompany = createAsyncThunk<
  Company,
  { id: string; reason: string },
  { rejectValue: string }
>("adminCompanies/reject", async ({ id, reason }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/v1/companies/admin/${id}/reject`, {
      reason,
    });
    return response.data.company || response.data.data || response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to reject company",
    );
  }
});

// Suspend Company
export const suspendCompany = createAsyncThunk<
  Company,
  { id: string; reason: string },
  { rejectValue: string }
>("adminCompanies/suspend", async ({ id, reason }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/v1/companies/admin/${id}/suspend`, {
      reason,
    });
    return response.data.company || response.data.data || response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to suspend company",
    );
  }
});

// Update Company
export const updateCompany = createAsyncThunk<
  Company,
  { id: string; data: UpdateCompanyDto },
  { rejectValue: string }
>("adminCompanies/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/v1/companies/admin/${id}`, data);
    return response.data.company || response.data.data || response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update company",
    );
  }
});

// Delete Company
export const deleteCompany = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("adminCompanies/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/v1/companies/admin/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete company",
    );
  }
});

const adminCompanySlice = createSlice({
  name: "adminCompanies",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setSelectedCompany: (state, action: PayloadAction<Company | null>) => {
      state.selectedCompany = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<AdminCompanyState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };

      state.filteredCompanies = state.companies.filter((company) => {
        const matchesStatus =
          state.filters.status === "all" ||
          company.licenseStatus === state.filters.status;

        const matchesBusinessType =
          state.filters.businessType === "all" ||
          company.businessType === state.filters.businessType;

        const matchesSearch =
          !state.filters.search ||
          company.name
            ?.toLowerCase()
            .includes(state.filters.search.toLowerCase()) ||
          company.companyName
            ?.toLowerCase()
            .includes(state.filters.search.toLowerCase()) ||
          company.registrationNumber
            ?.toLowerCase()
            .includes(state.filters.search.toLowerCase()) ||
          company.email
            ?.toLowerCase()
            .includes(state.filters.search.toLowerCase()) ||
          company.tinNumber
            ?.toLowerCase()
            .includes(state.filters.search.toLowerCase());

        return matchesStatus && matchesBusinessType && matchesSearch;
      });
    },
    updateCompanyManually: (
      state,
      action: PayloadAction<{
        id: string;
        status: CompanyLicenseStatus;
        notes?: string;
      }>,
    ) => {
      const { id, status, notes } = action.payload;
      const index = state.companies.findIndex((c) => c._id === id);

      if (index !== -1) {
        const now = new Date().toISOString();
        const updates: Partial<Company> = {
          licenseStatus: status,
        };

        if (status === "approved") {
          updates.verificationDate = now;
          updates.verificationNotes = notes;
        } else if (status === "rejected") {
          updates.rejectedDate = now;
          updates.rejectedReason = notes;
        } else if (status === "suspended") {
          updates.suspendedDate = now;
          updates.suspendedReason = notes;
        }

        state.companies[index] = {
          ...state.companies[index],
          ...updates,
        };
        state.filteredCompanies = [...state.companies];
        state.stats = calculateStats(state.companies);
      }
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch all companies
    builder
      .addCase(fetchAllCompanies.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAllCompanies.fulfilled,
        (state, action: PayloadAction<Company[]>) => {
          state.fetchLoading = false;
          state.companies = action.payload;
          state.filteredCompanies = action.payload;
          state.stats = calculateStats(action.payload);
        },
      )
      .addCase(fetchAllCompanies.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload || "Failed to fetch companies";
      });

    // Fetch single company
    builder
      .addCase(fetchCompanyById.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCompanyById.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.fetchLoading = false;
          state.selectedCompany = action.payload;
        },
      )
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload || "Failed to fetch company";
      });

    // Approve company
    builder
      .addCase(approveCompany.pending, (state, action) => {
        state.actionLoading = action.meta.arg.id;
        state.error = null;
      })
      .addCase(
        approveCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.actionLoading = null;

          const index = state.companies.findIndex(
            (c) => c._id === action.payload._id,
          );
          if (index !== -1) {
            state.companies[index] = {
              ...state.companies[index],
              ...action.payload,
              licenseStatus: "approved",
            };
            state.filteredCompanies = [...state.companies];
            state.stats = calculateStats(state.companies);
          }

          if (state.selectedCompany?._id === action.payload._id) {
            state.selectedCompany = action.payload;
          }

          state.successMessage = "Company approved successfully!";
        },
      )
      .addCase(approveCompany.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload || "Failed to approve company";
      });

    // Reject company
    builder
      .addCase(rejectCompany.pending, (state, action) => {
        state.actionLoading = action.meta.arg.id;
        state.error = null;
      })
      .addCase(
        rejectCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.actionLoading = null;

          const index = state.companies.findIndex(
            (c) => c._id === action.payload._id,
          );
          if (index !== -1) {
            state.companies[index] = {
              ...state.companies[index],
              ...action.payload,
              licenseStatus: "rejected",
            };
            state.filteredCompanies = [...state.companies];
            state.stats = calculateStats(state.companies);
          }

          if (state.selectedCompany?._id === action.payload._id) {
            state.selectedCompany = action.payload;
          }

          state.successMessage = "Company rejected successfully!";
        },
      )
      .addCase(rejectCompany.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload || "Failed to reject company";
      });

    // Suspend company
    builder
      .addCase(suspendCompany.pending, (state, action) => {
        state.actionLoading = action.meta.arg.id;
        state.error = null;
      })
      .addCase(
        suspendCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.actionLoading = null;

          const index = state.companies.findIndex(
            (c) => c._id === action.payload._id,
          );
          if (index !== -1) {
            state.companies[index] = {
              ...state.companies[index],
              ...action.payload,
              licenseStatus: "suspended",
            };
            state.filteredCompanies = [...state.companies];
            state.stats = calculateStats(state.companies);
          }

          if (state.selectedCompany?._id === action.payload._id) {
            state.selectedCompany = action.payload;
          }

          state.successMessage = "Company suspended successfully!";
        },
      )
      .addCase(suspendCompany.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload || "Failed to suspend company";
      });

    // Update company
    builder
      .addCase(updateCompany.pending, (state, action) => {
        state.actionLoading = action.meta.arg.id;
        state.error = null;
      })
      .addCase(
        updateCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.actionLoading = null;

          const index = state.companies.findIndex(
            (c) => c._id === action.payload._id,
          );
          if (index !== -1) {
            state.companies[index] = {
              ...state.companies[index],
              ...action.payload,
            };
            state.filteredCompanies = [...state.companies];
            state.stats = calculateStats(state.companies);
          }

          if (state.selectedCompany?._id === action.payload._id) {
            state.selectedCompany = action.payload;
          }

          state.successMessage = "Company updated successfully!";
        },
      )
      .addCase(updateCompany.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload || "Failed to update company";
      });

    // Delete company
    builder
      .addCase(deleteCompany.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
        state.error = null;
      })
      .addCase(
        deleteCompany.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionLoading = null;
          state.companies = state.companies.filter(
            (c) => c._id !== action.payload,
          );
          state.filteredCompanies = state.filteredCompanies.filter(
            (c) => c._id !== action.payload,
          );
          state.stats = calculateStats(state.companies);

          if (state.selectedCompany?._id === action.payload) {
            state.selectedCompany = null;
          }

          state.successMessage = "Company deleted successfully!";
        },
      )
      .addCase(deleteCompany.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload || "Failed to delete company";
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setSelectedCompany,
  setFilters,
  updateCompanyManually,
  resetState,
} = adminCompanySlice.actions;

export default adminCompanySlice.reducer;
