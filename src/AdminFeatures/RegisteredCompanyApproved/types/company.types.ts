export type BusinessType =
  | "Sole Proprietorship"
  | "Partnership"
  | "Private Limited Company"
  | "Public Limited Company"
  | "Limited Liability Partnership (LLP)"
  | "Non-Profit Organization"
  | "Cooperative"
  | "Franchise"
  | "Joint Venture"
  | "Holding Company"
  | "Subsidiary"
  | "Other";

export type CompanyLicenseStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

export type Address = {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
};

export type Documents = {
  registrationCertificate: string;
  tinCertificate: string;
  businessLicense?: string;
};

export type Director = {
  fullName: string;
  position: string;
  nationality?: string;
  idNumber?: string;
};

export type BusinessOwnerRef = {
  _id: string;
  email: string;
  fullName: string;
  phone?: string;
};

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
  rejectedDate?: string;
  suspendedDate?: string;
  verificationNotes?: string;
  rejectedReason?: string;
  suspendedReason?: string;
  verifiedBy?: {
    _id: string;
    email: string;
    fullName: string;
  };
  rejectedBy?: {
    _id: string;
    email: string;
    fullName: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface UpdateCompanyDto {
  name?: string;
  companyName?: string;
  registrationNumber?: string;
  tinNumber?: string;
  businessType?: BusinessType;
  email?: string;
  phone?: string;
  website?: string;
  address?: Partial<Address>;
  industry?: string;
  sector?: string;
  description?: string;
  documents?: Partial<Documents>;
  directors?: Director[];
  isActive?: boolean;
}
