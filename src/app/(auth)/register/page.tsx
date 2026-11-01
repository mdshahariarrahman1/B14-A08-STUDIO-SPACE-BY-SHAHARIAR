import type { Metadata } from "next";

import RegisterScreen from "@/components/auth_component/RegisterScreen";

export const metadata: Metadata = {
  title: "Register | StudioSpace",
  description:
    "Create your StudioSpace account to book studios or list your own space.",
};

const RegisterPage = () => {
  return <RegisterScreen />;
};

export default RegisterPage;
