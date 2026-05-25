import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Animals from "./pages/Animals";
import AnimalProfile from "./pages/AnimalProfile";
import Donate from "./pages/Donate";
import Transparency from "./pages/Transparency";
import About from "./pages/About";
import Volunteer from "./pages/Volunteer";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AuthGuard from "./components/admin/AuthGuard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AnimalsList from "./pages/admin/animals/AnimalsList";
import AddAnimal from "./pages/admin/animals/AddAnimal";
import ExpensesList from "./pages/admin/expenses/ExpensesList";
import AddExpense from "./pages/admin/expenses/AddExpense";
import BlogsList from "./pages/admin/blogs/BlogsList";
import AddBlog from "./pages/admin/blogs/AddBlog";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import VolunteersList from "./pages/admin/VolunteersList";
import AdminGallery from "./pages/admin/AdminGallery";
import DonationsList from "./pages/admin/DonationsList";
import AdminSettings from "./pages/admin/AdminSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "animals", Component: Animals },
      { path: "animals/:id", Component: AnimalProfile },
      { path: "donate", Component: Donate },
      { path: "transparency", Component: Transparency },
      { path: "about", Component: About },
      { path: "volunteer", Component: Volunteer },
      { path: "blog", Component: Blog },
      { path: "blog/:slug", Component: BlogPost },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
  // Admin Auth Routes (Public)
  { path: "/admin/login", Component: AdminLogin },
  { path: "/admin/signup", Component: AdminSignup },
  
  // Admin Protected Routes
  {
    path: "/admin",
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, Component: AdminDashboard },
      { path: "dashboard", Component: AdminDashboard },
      { path: "animals", Component: AnimalsList },
      { path: "animals/add", Component: AddAnimal },
      { path: "expenses", Component: ExpensesList },
      { path: "expenses/add", Component: AddExpense },
      { path: "blogs", Component: BlogsList },
      { path: "blogs/add", Component: AddBlog },
      { path: "newsletter", Component: AdminNewsletter },
      { path: "donations", Component: DonationsList },
      { path: "volunteers", Component: VolunteersList },
      { path: "gallery", Component: AdminGallery },
      { path: "settings", Component: AdminSettings },
    ],
  },
]);

