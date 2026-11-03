import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import DashboardLayout from "../components/layout/DashboardLayout";

import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";

import StudentDashboard from "../pages/student/StudentDashboard";
import InstructorDashboard from "../pages/instructor/InstructorDashboard";

import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "../pages/NotFound";
import InstructorAvailabilityPage from "../features/instructor/InstructorAvailabilityPage";
import InstructorDetailsPage from "../pages/student/InstructorDetailPage";
import PaymentSuccessPage from "../pages/student/PaymentSuccessPage";
import PaymentCancelPage from "../pages/student/PaymentCancelPage";
import InstructorProfilePage from "../pages/instructor/InstructorProfilePage";
import StudentConsultationsPage from "../pages/student/StudentConsultationsPage";
import InstructorConsultationsPage from "../pages/instructor/InstructorConsultationsPage";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Student routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/student/dashboard"
              element={<StudentDashboard />}
            />
            <Route
              path="/instructors/:instructorId"
              element={<InstructorDetailsPage />}
            />
            <Route
              path="/payment/success"
              element={<PaymentSuccessPage />}
            />

            <Route
              path="/payment/cancel"
              element={<PaymentCancelPage />}
            />
            <Route
              path="/student/consultations"
              element={<StudentConsultationsPage />}
            />
          </Route>
        </Route>

        {/* Instructor routes */}
        <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/instructor/dashboard"
              element={<InstructorDashboard />}
            />
            <Route
              path="/instructor/profile"
              element={<InstructorProfilePage />}
            />
            <Route
              path="/instructor/availability"
              element={<InstructorAvailabilityPage />}
            />
            <Route
              path="/instructor/consultations"
              element={<InstructorConsultationsPage />}
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;