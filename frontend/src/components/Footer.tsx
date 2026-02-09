export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/90">
            {currentYear} MedReg. All rights reserved.
          </p>
          <p className="text-sm text-white/70">
            Patient Registration System
          </p>
        </div>
      </div>
    </footer>
  );
};
