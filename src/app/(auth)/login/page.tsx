import type { Metadata } from "next";

import LoginScreen from "@/components/auth_component/LoginScreen";

export const metadata: Metadata = {
  title: "Log in | StudioSpace",
  description: "Log in to manage your bookings and find your next studio.",
};

const LoginPage = () => {
  return <LoginScreen />;
};

export default LoginPage;
