import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-12 bg-white shadow-sm rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 text-center mb-8">
          You don&apos;t have permission to access this organization.
        </p>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/organizations">Return to Organizations</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
