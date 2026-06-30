import { Link } from "react-router-dom";

export default function InviteExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-[#191919] dark:text-white mb-2">
          Invitation expired
        </h1>
        <p className="text-[#8E8E93] mb-8">
          This invite link has expired. Please contact the team owner for a new invitation.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-[#191919] dark:bg-white text-white dark:text-[#191919] rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
