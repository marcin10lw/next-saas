import { redirect } from "next/navigation";

const SignIn = () => {
  redirect("/api/auth/login?post_login_redirect_url=/dashboard");
};

export default SignIn;
