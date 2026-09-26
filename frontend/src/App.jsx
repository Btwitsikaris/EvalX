import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import TeacherLogin from "./pages/TeacherLogin";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import TeacherPortal from "./pages/teacher/TeacherPortal";
import StudentPortal from "./pages/student/StudentPortal";
import AdminPortal from "./pages/admin/AdminPortal";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";
import ThemeToggle from "./components/ThemeToggle";
import { useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  return (
    <>
      <div className="globalThemeToggle"><ThemeToggle /></div>
      <PageTransition>
      <Routes location={location}>
      <Route path="/" element={<Landing />} />
      <Route path="/teacher/login" element={<TeacherLogin />} />
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/teacher/*" element={<ProtectedRoute role="teacher"><TeacherPortal /></ProtectedRoute>} />
      <Route path="/student/*" element={<ProtectedRoute role="student"><StudentPortal /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminPortal /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </PageTransition>
    </>
  );
}