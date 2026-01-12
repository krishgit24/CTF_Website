const Footer = () => {
  return (
    <footer className="relative w-full bg-black">
      {/* Top gradient separator */}
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />

      <div className="py-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500">
          IEEE CTF
        </h2>

        <p className="mt-3 text-sm md:text-base tracking-widest text-yellow-400/80">
          CAPTURE THE FLAG CHALLENGE
        </p>

        <div className="mt-5 w-36 h-[1px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />
      </div>
    </footer>
  );
};

export default Footer;
