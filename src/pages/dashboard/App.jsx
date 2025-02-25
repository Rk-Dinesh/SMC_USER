import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./pages/layout/Layout";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./404";
import SignIn from "./pages/auth/SignIn";
import OTP from "./pages/auth/OTP";
import Dashboard from "./pages/dashboard/Dashboard";
import MyCourses from "./pages/courses/MyCourses";
import GenerateCourse from "./pages/courses/GenerateCourse";
import HelpSupport from "./pages/help&support/HelpSupport";
import NewTicket from "./pages/help&support/NewTicket";
import FAQ from "./pages/faq/FAQ";
import Notification from "./pages/notification/Notification";
import TermsService from "./pages/terms/TermsService";
import PrivacyPolicy from "./pages/terms/PrivacyPolicy";
import Profile from "./pages/profile/Profile";
import LogOut from "./pages/auth/LogOut";
import ViewTicket from "./pages/help&support/ViewTicket";
import Certificate from "./pages/certificate/Certificate";
import ViewCertificate from "./pages/certificate/ViewCertificate";
import Subscription from "./pages/subscription/Subscription";
import Invoice from "./pages/subscription/Invoice";
import ListTopics from "./pages/courses/ListTopics";
import Content from "./pages/courses/Content";
import ImageUploader from "./pages/auth/Test";
import Pricing from "./pages/subscription/Pricing";
import Payment from "./pages/subscription/Payment";
import Success from "./pages/subscription/Success";
import Failed from "./pages/subscription/Failed";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/content" element={<Content />} />
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course" element={<MyCourses />} />
            <Route path="/create" element={<GenerateCourse />} />
            <Route path="/topics" element={<ListTopics />} />           
            <Route path="/support" element={<HelpSupport />} />
            <Route path="/newticket" element={<NewTicket />} />
            <Route path="/viewticket" element={<ViewTicket />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/notify" element={<Notification />} />
            <Route path="/terms" element={<TermsService />} />
            <Route path="/policy" element={<PrivacyPolicy />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/certificate" element={<Certificate />} />
            <Route path="/viewcertificate" element={<ViewCertificate />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failed" element={<Failed />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/uploder" element={<ImageUploader />} />

          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
