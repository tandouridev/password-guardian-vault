
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PasswordsPage from "./pages/PasswordsPage";
import SettingsPage from "./pages/SettingsPage";
import CheckupPage from "./pages/CheckupPage";
import PasswordDetailPage from "./pages/PasswordDetailPage";
import PasswordAnalysisPage from "./pages/PasswordAnalysisPage";
import SecureNotesPage from "./pages/SecureNotesPage";
import PasswordContextProvider from "./context/PasswordContext";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PasswordContextProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<PasswordsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="checkup" element={<CheckupPage />} />
              <Route path="analysis" element={<PasswordAnalysisPage />} />
              <Route path="notes" element={<SecureNotesPage />} />
              <Route path="password/:id" element={<PasswordDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PasswordContextProvider>
  </QueryClientProvider>
);

export default App;
