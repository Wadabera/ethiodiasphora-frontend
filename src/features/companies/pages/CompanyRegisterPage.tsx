import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { registerCompany, fetchMyCompanies } from "../slices/companySlice";
import {
  BusinessType,
  CompanyLicenseStatusUtils,
  BusinessTypeUtils,
  type RegisterCompanyDto,
  type Director,
} from "../types/company.types";
import {
  Building2,
  ArrowLeft,
  CheckCircle,
  Loader2,
  AlertCircle,
  Info,
  FileText,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Save,
  X,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Clock,
  Shield,
  Sparkles,
} from "lucide-react";

const CompanyRegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { myCompanies, registering, success, error } = useAppSelector(
    (state) => state.companies,
  );

  // ============ 1. ALL STATE DECLARATIONS FIRST ============
  const [hasCheckedCompany, setHasCheckedCompany] = useState(false);
  const [isViewingRegister, setIsViewingRegister] = useState(true);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [existingCompanyWithSameReg, setExistingCompanyWithSameReg] =
    useState<any>(null);

  // Form state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterCompanyDto>({
    name: "",
    registrationNumber: "",
    tinNumber: "",
    businessType: BusinessType.PRIVATE_LIMITED_COMPANY,
    email: "",
    phone: "",
    website: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Ethiopia",
    },
    industry: "",
    description: "",
    documents: {
      registrationCertificate: "",
      tinCertificate: "",
      businessLicense: "",
    },
    directors: [],
  });

  // Director form state
  const [directorForm, setDirectorForm] = useState<Director>({
    fullName: "",
    position: "",
    nationality: "Ethiopian",
    idNumber: "",
  });

  const [showDirectorForm, setShowDirectorForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredCompany, setRegisteredCompany] = useState<any>(null);

  // ============ 2. CONSTANTS & STATIC DATA ============
  const ethiopianIndustries = [
    "Agriculture",
    "Manufacturing",
    "Information Technology",
    "Financial Services",
    "Real Estate",
    "Construction",
    "Hospitality",
    "Retail",
    "Transportation",
    "Healthcare",
    "Education",
    "Renewable Energy",
    "Textile",
    "Coffee Export",
    "Flower Export",
    "Mining",
    "Telecommunications",
    "Other",
  ];

  const businessTypes = BusinessTypeUtils.getOptions();

  // ============ 3. GET CURRENT COMPANY ============
  // Get the first company from myCompanies array
  const myCompany =
    myCompanies && myCompanies.length > 0 ? myCompanies[0] : null;

  // ============ 4. NAVIGATION HANDLERS ============
  const handleViewProfile = useCallback(() => {
    navigate("/business/company/profile");
  }, [navigate]);

  const handleDashboard = useCallback(() => {
    navigate("/business");
  }, [navigate]);

  // ============ 5. FORM ACTIONS ============
  const fillDemoData = useCallback(() => {
    setFormData({
      name: "TechVision Solutions PLC",
      registrationNumber: "REG-2024-001237",
      tinNumber: "TIN-987654321",
      businessType: BusinessType.PRIVATE_LIMITED_COMPANY,
      email: "info@techvision.com",
      phone: "+251911234567",
      website: "https://techvision.com",
      address: {
        street: "Bole Road, Atlas Building",
        city: "Addis Ababa",
        state: "Addis Ababa",
        postalCode: "1000",
        country: "Ethiopia",
      },
      industry: "Information Technology",
      description:
        "Leading software development company providing innovative solutions for the Ethiopian market.",
      documents: {
        registrationCertificate: "https://example.com/reg.pdf",
        tinCertificate: "https://example.com/tin.pdf",
        businessLicense: "https://example.com/license.pdf",
      },
      directors: [
        {
          fullName: "Abebe Kebede",
          position: "CEO",
          nationality: "Ethiopian",
          idNumber: "ID-123456789",
        },
      ],
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      registrationNumber: "",
      tinNumber: "",
      businessType: BusinessType.PRIVATE_LIMITED_COMPANY,
      email: "",
      phone: "",
      website: "",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Ethiopia",
      },
      industry: "",
      description: "",
      documents: {
        registrationCertificate: "",
        tinCertificate: "",
        businessLicense: "",
      },
      directors: [],
    });
    setStep(1);
    setErrors({});
    setShowSuccess(false);
    setRegisteredCompany(null);
    setDuplicateError(null);
    setExistingCompanyWithSameReg(null);
  }, []);

  // ============ 6. VALIDATION ============
  const validateStep = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name?.trim()) newErrors.name = "Company name is required";
      if (!formData.registrationNumber?.trim())
        newErrors.registrationNumber = "Registration number is required";
      if (!formData.tinNumber?.trim())
        newErrors.tinNumber = "TIN number is required";
      if (!formData.businessType)
        newErrors.businessType = "Business type is required";
    }

    if (step === 2) {
      if (!formData.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!formData.phone?.trim()) {
        newErrors.phone = "Phone number is required";
      }

      if (!formData.address?.street?.trim())
        newErrors["address.street"] = "Street address is required";
      if (!formData.address?.city?.trim())
        newErrors["address.city"] = "City is required";
      if (!formData.address?.postalCode?.trim())
        newErrors["address.postalCode"] = "Postal code is required";
      if (!formData.address?.country?.trim())
        newErrors["address.country"] = "Country is required";
    }

    if (step === 3) {
      if (!formData.industry?.trim())
        newErrors.industry = "Industry is required";
      if (!formData.description?.trim())
        newErrors.description = "Company description is required";
    }

    if (step === 4) {
      if (!formData.documents?.registrationCertificate?.trim()) {
        newErrors["documents.registrationCertificate"] =
          "Registration certificate is required";
      }
      if (!formData.documents?.tinCertificate?.trim()) {
        newErrors["documents.tinCertificate"] = "TIN certificate is required";
      }
    }

    return newErrors;
  }, [step, formData]);

  // ============ 7. STEP HANDLERS ============
  const handleNext = useCallback(() => {
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStep((prev) => prev + 1);
  }, [validateStep]);

  const handlePrevious = useCallback(() => {
    setStep((prev) => prev - 1);
    setErrors({});
  }, []);

  // ============ 8. INPUT HANDLERS ============
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;

      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        if (parent === "address") {
          setFormData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              [child]: value,
            },
          }));
        } else if (parent === "documents") {
          setFormData((prev) => ({
            ...prev,
            documents: {
              ...prev.documents,
              [child]: value,
            },
          }));
        }
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }

      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors],
  );

  // ============ 9. DIRECTOR HANDLERS ============
  const addDirector = useCallback(() => {
    if (
      !directorForm.fullName?.trim() ||
      !directorForm.position?.trim() ||
      !directorForm.idNumber?.trim()
    ) {
      alert("Please fill all required director fields");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      directors: [...(prev.directors || []), { ...directorForm }],
    }));

    setDirectorForm({
      fullName: "",
      position: "",
      nationality: "Ethiopian",
      idNumber: "",
    });
    setShowDirectorForm(false);
  }, [directorForm]);

  const removeDirector = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      directors: prev.directors?.filter((_, i) => i !== index),
    }));
  }, []);

  const fillDemoCompany = useCallback(() => {
    const rnd = Math.floor(1000 + Math.random() * 9000);
    setFormData({
      name: `Abyssinia Premium Logistics PLC`,
      registrationNumber: `ETH-COM-2026-${rnd}`,
      tinNumber: `00${rnd}8891`,
      businessType: BusinessType.PRIVATE_LIMITED_COMPANY,
      email: "business@ethiodiaspora.com",
      phone: "+251911000002",
      website: "https://abyssiniacoffee.et",
      address: {
        street: "Bole Medhanialem, Sub-city 03",
        city: "Addis Ababa",
        state: "Addis Ababa",
        postalCode: "1000",
        country: "Ethiopia",
      },
      industry: "Agriculture",
      description: "Leading producer and exporter of single-origin specialty Arabica coffee and agri-logistics.",
      documents: {
        registrationCertificate: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
        tinCertificate: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
        businessLicense: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
      },
      directors: [
        {
          fullName: "Dawit Haile",
          position: "Managing Director",
          nationality: "Ethiopian",
          idNumber: "ETH-NAT-98442",
        },
      ],
    });
    setErrors({});
  }, []);

  // ============ 10. SUBMIT HANDLER ============
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validateStep();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      try {
        // Create a clean copy of the data
        const submitData = { ...formData };

        // Remove empty fields
        if (!submitData.website?.trim()) {
          delete submitData.website;
        }

        if (!submitData.documents.businessLicense?.trim()) {
          delete submitData.documents.businessLicense;
        }

        if (!submitData.directors || submitData.directors.length === 0) {
          delete submitData.directors;
        }

        // Remove empty address fields
        if (submitData.address?.state?.trim() === "") {
          delete submitData.address.state;
        }

        const result = await dispatch(registerCompany(submitData)).unwrap();
        setRegisteredCompany(result);
        setDuplicateError(null);
        setExistingCompanyWithSameReg(null);
        setShowSuccess(true);

        // ✅ Refresh the companies list after successful registration
        await dispatch(fetchMyCompanies());
      } catch (err: any) {
        console.error("Failed to register company:", err);

        // Check for duplicate registration error
        const errorMessage = err?.message || err?.response?.data?.message || "";
        if (
          errorMessage.includes("registration number already exists") ||
          errorMessage.includes("duplicate")
        ) {
          setDuplicateError(
            "This registration number is already registered. Please use a different number.",
          );

          // Try to extract existing company from error response
          if (err?.response?.data?.existingCompany) {
            setExistingCompanyWithSameReg(err.response.data.existingCompany);
          }
        }
      }
    },
    [dispatch, formData, validateStep],
  );

  // ============ 11. EFFECTS ============
  useEffect(() => {
    const checkCompany = async () => {
      try {
        await dispatch(fetchMyCompanies()).unwrap();
      } catch (error) {
        // No company found - expected for new users
        console.log("No existing company found - ready for registration");
      } finally {
        setHasCheckedCompany(true);
      }
    };

    checkCompany();
  }, [dispatch]);

  useEffect(() => {
    if (success && registeredCompany) {
      setShowSuccess(true);
    }
  }, [success, registeredCompany]);

  // Clear duplicate error when form changes
  useEffect(() => {
    if (formData.registrationNumber || formData.name) {
      setDuplicateError(null);
      setExistingCompanyWithSameReg(null);
    }
  }, [formData.registrationNumber, formData.name]);

  // ============ 12. EARLY RETURNS ============
  if (!hasCheckedCompany) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Checking company status...</p>
        </div>
      </div>
    );
  }

  // ✅ FIXED: Check if user has any companies
  if (myCompany && isViewingRegister) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Company Already Registered
          </h2>
          <p className="text-gray-400 mb-2">
            You already have a registered company:
          </p>
          <p className="text-white font-semibold mb-2">
            {myCompany.name || myCompany.companyName}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Reg. #{myCompany.registrationNumber}
          </p>

          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white">Verification Status:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${CompanyLicenseStatusUtils.getBadgeClass(myCompany.licenseStatus)}`}
              >
                {CompanyLicenseStatusUtils.format(myCompany.licenseStatus)}
              </span>
            </div>
            {myCompany.licenseStatus === "approved" && (
              <p className="text-xs text-green-400 mt-1">
                ✓ Verified company - You can create IPOs
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleViewProfile}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all"
            >
              View Company Profile
            </button>
            <button
              onClick={handleDashboard}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all"
            >
              Dashboard
            </button>
          </div>

          <button
            onClick={() => setIsViewingRegister(false)}
            className="mt-4 text-sm text-gray-500 hover:text-yellow-400 transition-colors"
          >
            Register a different company
          </button>
        </div>
      </div>
    );
  }

  // ============ 13. MAIN RENDER ============
  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* ===== DUPLICATE REGISTRATION ERROR MODAL ===== */}
      {duplicateError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">
              Registration Number Already Exists
            </h3>
            <p className="text-gray-400 text-center mb-6">{duplicateError}</p>

            {existingCompanyWithSameReg && (
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 mb-6">
                <p className="text-sm text-white mb-2">
                  This registration number belongs to:
                </p>
                <p className="text-white font-semibold">
                  {existingCompanyWithSameReg.name ||
                    existingCompanyWithSameReg.companyName}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Registered on:{" "}
                  {new Date(
                    existingCompanyWithSameReg.registrationDate ||
                      existingCompanyWithSameReg.createdAt,
                  ).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDuplicateError(null);
                  setExistingCompanyWithSameReg(null);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all"
              >
                Try Different Number
              </button>
              <button
                onClick={handleViewProfile}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
              >
                View My Company
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUCCESS MODAL ===== */}
      {showSuccess && registeredCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">
              Company Registered Successfully!
            </h3>
            <p className="text-gray-400 text-center mb-6">
              Your company is pending verification. You'll be notified once
              verified.
            </p>

            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Company Name</span>
                <span className="text-white font-bold">
                  {registeredCompany.name || registeredCompany.companyName}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Registration Number</span>
                <span className="text-yellow-400 font-bold">
                  {registeredCompany.registrationNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-yellow-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {CompanyLicenseStatusUtils.format(
                    registeredCompany.licenseStatus,
                  )}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleViewProfile}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all"
              >
                View Company Profile
              </button>
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
              >
                Register Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== HEADER ===== */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <button
                onClick={handleDashboard}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg">
                  <Building2 className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Register Your Company
                  </h1>
                  <p className="text-sm text-gray-400">
                    Required before creating IPOs or investment opportunities
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={fillDemoCompany}
              className="px-4 py-2 bg-[#FFD700]/15 hover:bg-[#FFD700]/25 border border-[#FFD700]/50 text-[#FFD700] rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Sparkles size={16} /> Fill Demo Company
            </button>
          </div>
        </div>
      </div>

      {/* ===== PROGRESS STEPS ===== */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          {[
            { step: 1, label: "Basic Info", icon: Building2 },
            { step: 2, label: "Contact", icon: Mail },
            { step: 3, label: "Business Details", icon: Briefcase },
            { step: 4, label: "Documents", icon: FileText },
            { step: 5, label: "Directors", icon: Users },
          ].map((item) => (
            <div key={item.step} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    step > item.step
                      ? "bg-yellow-400 text-black"
                      : step === item.step
                        ? "bg-yellow-400/20 border-2 border-yellow-400 text-yellow-400"
                        : "bg-gray-800 text-gray-500"
                  }
                `}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <span
                  className={`
                  ml-3 text-sm font-medium hidden md:block
                  ${step === item.step ? "text-yellow-400" : "text-gray-500"}
                `}
                >
                  {item.label}
                </span>
              </div>
              {item.step < 5 && (
                <div className="w-12 md:w-24 h-0.5 mx-2 md:mx-4 bg-gray-800">
                  <div
                    className={`
                    h-full bg-yellow-400 transition-all duration-500
                    ${step > item.step ? "w-full" : "w-0"}
                  `}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===== FORM ===== */}
      <div className="max-w-4xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ===== STEP 1: BASIC INFORMATION ===== */}
          {step === 1 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-yellow-400" />
                Basic Company Information
              </h2>

              <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-400/10 rounded-lg">
                    <Info className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white mb-1">Important</p>
                    <p className="text-xs text-gray-400">
                      This information must match your official business
                      registration documents. Verification is required before
                      you can create IPOs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Legal Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-gray-800 border ${errors.name ? "border-red-500" : "border-gray-700"} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                    placeholder="TechVision Solutions PLC"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className={`w-full bg-gray-800 border ${errors.registrationNumber ? "border-red-500" : "border-gray-700"} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                    placeholder="REG-2024-001237"
                  />
                  {errors.registrationNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    TIN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tinNumber"
                    value={formData.tinNumber}
                    onChange={handleChange}
                    className={`w-full bg-gray-800 border ${errors.tinNumber ? "border-red-500" : "border-gray-700"} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                    placeholder="TIN-987654321"
                  />
                  {errors.tinNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.tinNumber}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className={`w-full bg-gray-800 border ${errors.businessType ? "border-red-500" : "border-gray-700"} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                  >
                    {businessTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {BusinessTypeUtils.getIcon(type.value)} {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.businessType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.businessType}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== STEP 2: CONTACT INFORMATION ===== */}
          {step === 2 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-yellow-400" />
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-gray-800 border ${errors.email ? "border-red-500" : "border-gray-700"} text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                      placeholder="info@company.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full bg-gray-800 border ${errors.phone ? "border-red-500" : "border-gray-700"} text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                      placeholder="+251911234567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Website (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website || ""}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400"
                      placeholder="https://www.company.com"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-md font-medium text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                  Business Address
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className={`w-full bg-gray-800 border ${errors["address.street"] ? "border-red-500" : "border-gray-700"} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                      placeholder="Bole Road, Atlas Building"
                    />
                    {errors["address.street"] && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors["address.street"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className={`w-full bg-gray-800 border ${errors["address.city"] ? "border-red-500" : "border-gray-700"} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                      placeholder="Addis Ababa"
                    />
                    {errors["address.city"] && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors["address.city"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      State/Region (Optional)
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state || ""}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400"
                      placeholder="Addis Ababa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      className={`w-full bg-gray-800 border ${errors["address.postalCode"] ? "border-red-500" : "border-gray-700"} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                      placeholder="1000"
                    />
                    {errors["address.postalCode"] && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors["address.postalCode"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      className={`w-full bg-gray-800 border ${errors["address.country"] ? "border-red-500" : "border-gray-700"} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                      placeholder="Ethiopia"
                    />
                    {errors["address.country"] && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors["address.country"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== STEP 3: BUSINESS DETAILS ===== */}
          {step === 3 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-yellow-400" />
                Business Details
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className={`w-full bg-gray-800 border ${errors.industry ? "border-red-500" : "border-gray-700"} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                  >
                    <option value="">Select Industry</option>
                    {ethiopianIndustries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.industry}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Company Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full bg-gray-800 border ${errors.description ? "border-red-500" : "border-gray-700"} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                    placeholder="Describe your business, products/services, market presence, and growth potential..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    {formData.description.length}/500 characters
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===== STEP 4: DOCUMENTS ===== */}
          {step === 4 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-400" />
                Required Documents
              </h2>

              <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-400/10 rounded-lg">
                    <FileText className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white mb-1">
                      Document Upload Instructions
                    </p>
                    <p className="text-xs text-gray-400">
                      Please provide URLs to your documents. Documents must be
                      in PDF format, clear, legible, and match the information
                      provided above.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Business Registration Certificate{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="documents.registrationCertificate"
                    value={formData.documents.registrationCertificate}
                    onChange={handleChange}
                    className={`w-full bg-gray-800 border ${errors["documents.registrationCertificate"] ? "border-red-500" : "border-gray-700"} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                    placeholder="https://example.com/registration-certificate.pdf"
                  />
                  {errors["documents.registrationCertificate"] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors["documents.registrationCertificate"]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    TIN Certificate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="documents.tinCertificate"
                    value={formData.documents.tinCertificate}
                    onChange={handleChange}
                    className={`w-full bg-gray-800 border ${errors["documents.tinCertificate"] ? "border-red-500" : "border-gray-700"} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400`}
                    placeholder="https://example.com/tin-certificate.pdf"
                  />
                  {errors["documents.tinCertificate"] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors["documents.tinCertificate"]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Business License (Optional)
                  </label>
                  <input
                    type="url"
                    name="documents.businessLicense"
                    value={formData.documents.businessLicense || ""}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400"
                    placeholder="https://example.com/business-license.pdf"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ===== STEP 5: DIRECTORS ===== */}
          {step === 5 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-400" />
                Company Directors
              </h2>

              <div className="bg-blue-400/5 border border-blue-400/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-400/10 rounded-lg">
                    <Info className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white mb-1">
                      Optional but Recommended
                    </p>
                    <p className="text-xs text-gray-400">
                      Adding directors helps build trust with investors. You can
                      add this information later.
                    </p>
                  </div>
                </div>
              </div>

              {/* Directors List */}
              {formData.directors && formData.directors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-white">
                    Added Directors
                  </h3>
                  {formData.directors.map((director, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white font-medium">
                          {director.fullName}
                        </p>
                        <p className="text-sm text-gray-400">
                          {director.position}
                        </p>
                        <div className="flex gap-3 mt-1">
                          <p className="text-xs text-gray-500">
                            {director.nationality}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {director.idNumber}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDirector(index)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Director Form */}
              {!showDirectorForm ? (
                <button
                  type="button"
                  onClick={() => setShowDirectorForm(true)}
                  className="w-full p-4 border-2 border-dashed border-gray-700 rounded-xl hover:border-yellow-400/50 transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-yellow-400"
                >
                  <Plus className="w-5 h-5" />
                  Add Director
                </button>
              ) : (
                <div className="bg-gray-800/30 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">
                      Add Director
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowDirectorForm(false)}
                      className="p-1 hover:bg-gray-700 rounded"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={directorForm.fullName}
                        onChange={(e) =>
                          setDirectorForm({
                            ...directorForm,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                        placeholder="Abebe Kebede"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Position <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={directorForm.position}
                        onChange={(e) =>
                          setDirectorForm({
                            ...directorForm,
                            position: e.target.value,
                          })
                        }
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                        placeholder="CEO"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Nationality <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={directorForm.nationality}
                        onChange={(e) =>
                          setDirectorForm({
                            ...directorForm,
                            nationality: e.target.value,
                          })
                        }
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                        placeholder="Ethiopian"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">
                        ID/Passport Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={directorForm.idNumber}
                        onChange={(e) =>
                          setDirectorForm({
                            ...directorForm,
                            idNumber: e.target.value,
                          })
                        }
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                        placeholder="ID-123456789"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addDirector}
                    className="w-full px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-lg hover:bg-yellow-400/30 transition-colors text-sm font-medium"
                  >
                    Add to List
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && !duplicateError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between gap-4 pt-6">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {step === 1 && (
                <button
                  type="button"
                  onClick={fillDemoData}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all"
                >
                  Fill Demo Data
                </button>
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg shadow-yellow-500/25 flex items-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={registering}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {registering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Register Company
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* ===== VERIFICATION NOTE ===== */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-white font-medium">
                Verification Process
              </p>
              <p className="text-xs text-gray-400">
                After submission, our team will verify your company documents
                within 2-3 business days. Once verified, you'll be able to
                create IPOs and investment opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegisterPage;
