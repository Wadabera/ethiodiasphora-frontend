import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreateIPOForm } from "../components/CreateIPOForm";
import { createIPO, clearCreateState } from "../slice/businessIPOSlice";
import type { CreateIPORequest } from "../types/businessIPOtypes";
import type { RootState } from "@/store/store";

export const CreateIPOPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createLoading, createSuccess, createError } = useSelector(
    (state: RootState) => state.businessIPO,
  );

  useEffect(() => {
    if (createSuccess) {
      navigate("/business/my-ipos");
      dispatch(clearCreateState());
    }
  }, [createSuccess, navigate, dispatch]);

  const handleSubmit = (data: CreateIPORequest) => {
    dispatch(createIPO(data) as any);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#FFD700]">Create New IPO</h1>
          <p className="text-gray-400 mt-2">
            Fill in the details below to create your IPO proposal. All fields
            marked with <span className="text-red-500">*</span> are required.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-6">
          <CreateIPOForm
            onSubmit={handleSubmit}
            loading={createLoading}
            error={createError}
          />
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-900/30 border border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-400 mb-2">
            What happens next?
          </h3>
          <ul className="text-sm text-blue-300 space-y-1 list-disc list-inside">
            <li>Your IPO will be submitted for admin review</li>
            <li>Status becomes: Pending Approval</li>
            <li>Admin will verify documents and approve/reject</li>
            <li>You'll be notified via email when reviewed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
