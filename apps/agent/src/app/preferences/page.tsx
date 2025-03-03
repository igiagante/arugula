"use client";

import { UserPreferencesModal } from "@/components/user/user-preferences-modal";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { useRouter } from "next/navigation";

export default function PreferencesPage() {
  const { preferences, updatePreferences } = useUserPreferences();
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back(); // Navigate back when modal is closed
    }
  };

  // console.log("PreferencesPage preferences", preferences);

  return (
    <div className="container mx-auto py-6">
      <div className="mt-6">
        <UserPreferencesModal
          open={true}
          onOpenChange={handleOpenChange}
          onSubmit={updatePreferences}
          preferences={preferences}
        />
      </div>
    </div>
  );
}
