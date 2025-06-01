import LoginForm from "../components/admin-login/LoginForm";
import LoginHeader from "../components/admin-login/LoginHeader";


const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0060a1] to-[#1887c3] p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in">
        <div className="p-8 sm:p-10">
          <LoginHeader />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;