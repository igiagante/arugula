import { Organization } from "@/components/organization/types";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { CreditCard } from "lucide-react";

interface SettingsTabProps {
  organization: Organization;
}

export function SettingsTab({ organization }: SettingsTabProps) {
  return (
    <div className="space-y-6 w-full">
      <Card className="p-5 w-full">
        <h3 className="text-sm font-medium text-black mb-4">
          Organization Details
        </h3>
        <div className="space-y-4 w-full">
          <div className="w-full">
            <Label className="block text-xs text-gray-500 mb-1">
              Organization Name
            </Label>
            <Input
              type="text"
              defaultValue={organization.name}
              className="w-full p-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="w-full">
            <Label className="block text-xs text-gray-500 mb-1">
              Organization ID
            </Label>
            <div className="flex items-center p-2 border border-gray-200 rounded-lg bg-gray-50 w-full">
              <span className="text-sm text-gray-700">{organization.id}</span>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Button className="text-sm bg-black text-white px-4 py-2 rounded-lg">
            Save Changes
          </Button>
        </div>
      </Card>

      <Card className="p-5 w-full">
        <h3 className="text-sm font-medium text-black mb-4">
          Billing Information
        </h3>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 w-full">
          <div className="flex items-center">
            <CreditCard className="size-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">Business Plan</span>
          </div>
          <Button
            variant={"link"}
            size="sm"
            className="text-xs text-black underline h-auto p-0"
          >
            Change Plan
          </Button>
        </div>
      </Card>

      <Card className="p-5 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-black">Danger Zone</h3>
        </div>
        <Button className="text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
          Delete Organization
        </Button>
      </Card>
    </div>
  );
}
