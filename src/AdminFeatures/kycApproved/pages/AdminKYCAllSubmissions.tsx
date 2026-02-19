// pages/AdminKYCAllSubmissions.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllKYCSubmissions } from '../slices/kycAdminSlice';
import KYCSubmissionCard from '../components/KYCSubmissionCard';
import { KYCSubmission } from '../types/kyc.types';

const AdminKYCAllSubmissions: React.FC = () => {
  const dispatch = useDispatch();
  const { allSubmissions, pagination, loading } = useSelector((state: any) => state.kycAdmin);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchAllKYCSubmissions({ 
      page: currentPage, 
      limit: 20,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      role