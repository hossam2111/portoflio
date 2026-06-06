import { SignIn } from "@clerk/nextjs";

export default function AdminSignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070A] bg-blueprint-subtle">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-[#F59E0B] flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-[#05070A]">I.Y</span>
          </div>
          <h1 className="text-xl font-semibold mb-1">Admin Dashboard</h1>
          <p className="text-sm text-[#64748B]">Sign in to manage your portfolio</p>
        </div>
        <SignIn
          fallbackRedirectUrl="/admin"
          signUpUrl={undefined}
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-[#0E141D] border border-[#1E293B] shadow-2xl",
              headerTitle: "text-[#F1F5F9]",
              headerSubtitle: "text-[#94A3B8]",
              formButtonPrimary:
                "bg-[#F59E0B] hover:bg-[#FFB300] text-[#05070A]",
              footerAction: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
