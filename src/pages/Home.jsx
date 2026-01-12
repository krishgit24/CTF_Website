import AuthPage from "./AuthPage";

const Home = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center px-4">
      {/* Heading
      <h1 className="mt-16 mb-10 text-3xl md:text-4xl font-bold text-yellow-400 text-center">
        IEEE Presents CTF Challenge
      </h1> */}
      {/* <h1 className="mt-16 mb-10 text-center font-mono">
        <span className="block text-xs tracking-[0.35em] text-gray-500 mb-2">
        IEEE PRESENTS
        </span>

        <span className="block text-4xl md:text-5xl font-bold text-yellow-400">
          CTF_CHALLENGE
        </span>
      </h1> */}
      <h1 className="mt-16 mb-10 text-center">
        <span className="block text-sm tracking-[0.3em] text-gray-400 mb-2">
          IEEE PRESENTS
        </span>

        <span className="block text-4xl md:text-5xl font-extrabold tracking-wide text-yellow-400">
          CTF CHALLENGE
        </span>
      </h1>

      {/* Auth Card */}
      <AuthPage />
      </div>
  );
};

export default Home;
