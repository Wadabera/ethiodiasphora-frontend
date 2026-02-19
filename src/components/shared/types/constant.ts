// features/kyc/shared/constants/kyc.constants.ts

export const KYC_STEPS = [
  { id: 1, title: "Personal Info", level: "basic" },
  { id: 2, title: "ID Verification", level: "intermediate" },
  { id: 3, title: "Address Proof", level: "intermediate" },
  { id: 4, title: "Review & Submit", level: "advanced" },
];

export const COUNTRIES = [
  "Ethiopia",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "United Arab Emirates",
  "South Africa",
  "Kenya",
];

export const DOCUMENT_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "national_id", label: "National ID" },
  { value: "drivers_license", label: "Driver's License" },
];

export const EMPLOYMENT_STATUS = [
  { value: "employed", label: "Employed" },
  { value: "self_employed", label: "Self Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "student", label: "Student" },
  { value: "retired", label: "Retired" },
];

export const RISK_TOLERANCE = [
  { value: "low", label: "Low (Conservative)" },
  { value: "medium", label: "Medium (Balanced)" },
  { value: "high", label: "High (Aggressive)" },
];
