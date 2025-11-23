import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Learn from "./pages/Learn";
import Explore from "./pages/Explore";
import LanguageDetail from "./pages/LanguageDetail";
import Dictionary from "./pages/Dictionary";
import Contribute from "./pages/Contribute";
import Missions from "./pages/Missions";
import ValidatorDashboard from "./pages/ValidatorDashboard";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import Logo from "./components/Logo";
import { UserProvider } from "./context/UserContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Logo />
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/explore/:languageName" element={<LanguageDetail />} />
              <Route path="/dictionary" element={<Dictionary />} />
              <Route path="/contribute" element={<Contribute />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/validate" element={<ValidatorDashboard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
