// src/features/publicInvestment/pages/PublicInvestmentsPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  fetchPublicInvestments,
  fetchFeaturedInvestments,
  setFilters,
  clearFilters,
} from "../slices/publicInvestmentSlice";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import FeaturedInvestments from "../components/FeaturedInvestments";
import PublicInvestmentCard from "../components/PublicInvestmentCard";
import PublicInvestmentFilters from "../components/PublicInvestmentFilters";
import type{ PublicInvestmentFilters as FilterTypes } from "../types/publicInvestment.types";
import { ArrowRight, Search } from "lucide-react";

const PublicInvestmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { list, featured, loading, pagination } = useAppSelector(
    (state) => state.publicInvestments,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [sortBy, setSortBy] = useState<FilterTypes["sortBy"]>("newest");

  // Load data on mount
  useEffect(() => {
    dispatch(fetchFeaturedInvestments());
    loadInvestments();
  }, [dispatch]);

  const loadInvestments = (page = 1) => {
    dispatch(fetchPublicInvestments({ page, limit: 12 }));
  };

  // Filter and sort investments locally
  const filteredAndSortedInvestments = useMemo(() => {
    let result = [...list];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.title?.toLowerCase().includes(term) ||
          inv.businessName?.toLowerCase().includes(term) ||
          inv.description?.toLowerCase().includes(term) ||
          inv.sector?.toLowerCase().includes(term),
      );
    }

    // Apply sector filter
    if (selectedSector) {
      result = result.filter((inv) => inv.sector === selectedSector);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime(),
        );
        break;
      case "popular":
        result.sort(
          (a, b) => (b.investments?.length || 0) - (a.investments?.length || 0),
        );
        break;
      case "roi":
        result.sort(
          (a, b) => (b.expectedReturn || 0) - (a.expectedReturn || 0),
        );
        break;
      case "amount":
        result.sort((a, b) => (b.fundingGoal || 0) - (a.fundingGoal || 0));
        break;
      default:
        break;
    }

    return result;
  }, [list, searchTerm, selectedSector, sortBy]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    if (key === "sector") {
      setSelectedSector(value === "all" ? "" : value);
    } else if (key === "sortBy") {
      setSortBy(value as FilterTypes["sortBy"]);
    }
    dispatch(setFilters({ [key]: value }));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    dispatch(setFilters({ search: value || undefined }));
  };

  const handleClearFilters = () => {
    setSelectedSector("");
    setSearchTerm("");
    setSortBy("newest");
    dispatch(clearFilters());
  };

  // Navigation handlers
  const handleExploreClick = () => {
    document
      .getElementById("investments")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLearnMoreClick = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetStartedClick = () => {
    navigate("/register");
  };

  const handleInvestmentClick = (id: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/investor/investments/${id}`);
    } else {
      navigate("/login", { state: { from: `/investments/${id}` } });
    }
  };

  const handleViewAllClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/investor/investments");
    } else {
      navigate("/login", { state: { from: "/investments" } });
    }
  };

  // Get unique sectors
  const sectors = useMemo(() => {
    return [...new Set(list.map((inv) => inv.sector).filter(Boolean))];
  }, [list]);
  

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <HeroSection
        onExploreClick={handleExploreClick}
        onLearnMoreClick={handleLearnMoreClick}
      />

      {/* How It Works Section */}
      <div id="how-it-works">
        <HowItWorks onGetStartedClick={handleGetStartedClick} />
      </div>

      {/* Featured Investments */}
      <FeaturedInvestments
        investments={featured}
        onViewAll={handleViewAllClick}
        onInvestmentClick={handleInvestmentClick}
      />

      {/* All Investments Section */}
      <div id="investments" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              All{" "}
              <span className="text-green-400">Investment Opportunities</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover vetted businesses across Ethiopia seeking investment
            </p>
          </div>

          {/* Filters */}
          <PublicInvestmentFilters
            filters={{
              sector: selectedSector,
              sortBy: sortBy,
              search: searchTerm,
            }}
            sectors={sectors}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onSearchChange={handleSearchChange}
            searchTerm={searchTerm}
          />

          {/* Results Count */}
          <div className="mb-6 text-sm text-gray-400">
            Showing {filteredAndSortedInvestments.length} of {pagination.total}{" "}
            opportunities
          </div>

          {/* Investment Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredAndSortedInvestments.length === 0 ? (
            <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No investments found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or filters
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedInvestments.map((investment) => (
                  <PublicInvestmentCard
                    key={investment._id}
                    investment={investment}
                    onClick={handleInvestmentClick}
                  />
                ))}
              </div>

              {/* Load More */}
              {pagination.page < pagination.totalPages && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => loadInvestments(pagination.page + 1)}
                    className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-900 to-green-800 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl text-green-100 mb-10 max-w-3xl mx-auto">
            Join thousands of investors who are already supporting Ethiopian
            businesses and earning attractive returns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStartedClick}
              className="px-8 py-4 bg-white text-green-900 font-bold rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/how-it-works")}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              Learn More
            </button>
          </div>
          <p className="text-sm text-green-200 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="underline hover:text-white"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicInvestmentsPage;
