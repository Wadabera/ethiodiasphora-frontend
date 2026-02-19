// ============ EXACT MATCH WITH NESTJS BACKEND ============

// ===== Company License Status =====
export const CompanyLicenseStatus = {
  SUBMITTED: "submitted",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type CompanyLicenseStatus =
  (typeof CompanyLicenseStatus)[keyof typeof CompanyLicenseStatus];

// ===== Business Type - EXACT match with backend =====
export const BusinessType = {
  SOLE_PROPRIETORSHIP: "sole_proprietorship",
  PARTNERSHIP: "partnership",
  PRIVATE_LIMITED_COMPANY: "private_limited_company",
  PUBLIC_LIMITED_COMPANY: "public_limited_company",
  COOPERATIVE: "cooperative",
  NGO: "ngo",
  OTHER: "other",
} as const;

export type BusinessType = (typeof BusinessType)[keyof typeof BusinessType];

// ===== Address =====
export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

// ===== Documents =====
export interface Documents {
  registrationCertificate: string;
  tinCertificate: string;
  businessLicense?: string;
}

// ===== Director =====
export interface Director {
  fullName: string;
  position: string;
  nationality: string;
  idNumber: string;
}

// ===== Business Owner Reference =====
export interface BusinessOwnerRef {
  _id: string;
  email: string;
  fullName: string;
}

// ===== Complete Company schema =====
export interface Company {
  _id: string;
  name: string;
  companyName?: string;
  registrationNumber: string;
  tinNumber: string;
  businessType: BusinessType;
  email: string;
  phone: string;
  phoneNumber?: string;
  website?: string;
  address: Address;
  industry: string;
  sector?: string;
  description: string;
  documents: Documents;
  directors: Director[];
  businessOwnerId: BusinessOwnerRef | string;
  licenseStatus: CompanyLicenseStatus;
  registrationDate: string;
  verificationDate?: string;
  verificationNotes?: string;
  verifiedBy?: {
    _id: string;
    email: string;
    fullName: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// ===== API Response for my-companies =====
export interface MyCompaniesResponse {
  total: number;
  companies: Company[];
}

// ===== RegisterCompanyDto =====
export interface RegisterCompanyDto {
  name: string;
  registrationNumber: string;
  tinNumber: string;
  businessType: BusinessType;
  email: string;
  phone: string;
  website?: string;
  address: Address;
  industry: string;
  description: string;
  documents: Documents;
  directors?: Director[];
}

// ===== UpdateCompanyDto =====
export interface UpdateCompanyDto {
  name?: string;
  registrationNumber?: string;
  tinNumber?: string;
  businessType?: BusinessType;
  email?: string;
  phone?: string;
  website?: string;
  address?: Partial<Address>;
  industry?: string;
  description?: string;
  documents?: Partial<Documents>;
  directors?: Director[];
}

// ============ UTILITIES ============

export const BusinessTypeUtils = {
  format: (type: string | undefined): string => {
    if (!type) return "Unknown";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },
  getOptions: () => {
    return Object.entries(BusinessType).map(([key, value]) => ({
      value,
      label: key
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" "),
    }));
  },
  getIcon: (type: string | undefined): string => {
    switch (type) {
      case BusinessType.SOLE_PROPRIETORSHIP:
        return "👤";
      case BusinessType.PARTNERSHIP:
        return "🤝";
      case BusinessType.PRIVATE_LIMITED_COMPANY:
        return "🏢";
      case BusinessType.PUBLIC_LIMITED_COMPANY:
        return "🏛️";
      case BusinessType.COOPERATIVE:
        return "🤲";
      case BusinessType.NGO:
        return "❤️";
      case BusinessType.OTHER:
        return "📋";
      default:
        return "🏢";
    }
  },
};

export const CompanyLicenseStatusUtils = {
  format: (status: string | undefined): string => {
    if (!status) return "Unknown";
    switch (status) {
      case CompanyLicenseStatus.SUBMITTED:
        return "Pending Verification";
      case CompanyLicenseStatus.APPROVED:
        return "Verified";
      case CompanyLicenseStatus.REJECTED:
        return "Rejected";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  },
  getBadgeClass: (status: string | undefined): string => {
    if (!status)
      return "bg-gray-400/10 text-gray-400 border border-gray-400/30";
    switch (status) {
      case CompanyLicenseStatus.APPROVED:
        return "bg-green-400/10 text-green-400 border border-green-400/30";
      case CompanyLicenseStatus.SUBMITTED:
        return "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30";
      case CompanyLicenseStatus.REJECTED:
        return "bg-red-400/10 text-red-400 border border-red-400/30";
      default:
        return "bg-gray-400/10 text-gray-400 border border-gray-400/30";
    }
  },
  getIcon: (status: string | undefined): string => {
    switch (status) {
      case CompanyLicenseStatus.APPROVED:
        return "✅";
      case CompanyLicenseStatus.SUBMITTED:
        return "⏳";
      case CompanyLicenseStatus.REJECTED:
        return "❌";
      default:
        return "❓";
    }
  },
};

export const CompanyUtils = {
  formatDate: (date: string | undefined): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },
  formatPhone: (phone: string | undefined): string => {
    if (!phone) return "N/A";
    return phone;
  },
  formatAddress: (address: Address | undefined): string => {
    if (!address) return "N/A";
    const parts = [
      address.street,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ].filter(Boolean);
    return parts.join(", ");
  },
  getInitials: (name: string): string => {
    if (!name) return "CO";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  },
};
