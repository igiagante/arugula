import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Mail, MoreHorizontal, Plus } from "lucide-react";
import { Member } from "../types";

interface MembersTabProps {
  members: Member[];
}

export function MembersTab({ members }: MembersTabProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b">
        <CardTitle className="text-base font-medium">
          Organization Members
        </CardTitle>
        <Button size="sm" variant="default" className="h-7 px-3 py-1 text-xs">
          <Plus className="size-3 mr-1" />
          Add Member
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-xs uppercase py-4 px-6">
                NAME
              </TableHead>
              <TableHead className="text-xs uppercase py-4 px-6">
                EMAIL
              </TableHead>
              <TableHead className="text-xs uppercase py-4 px-6">
                ROLE
              </TableHead>
              <TableHead className="text-xs uppercase py-4 px-6">
                JOINED
              </TableHead>
              <TableHead className="w-10 px-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="hover:bg-gray-50">
                <TableCell className="py-5 px-6">
                  <div className="flex items-center">
                    <Avatar className="size-9 mr-3 rounded-full">
                      <AvatarFallback className="bg-gray-100 border border-gray-200 text-sm rounded-full">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{member.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-5 px-6">
                  <div className="flex items-center">
                    <Mail className="size-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">
                      {member.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-5 px-6">
                  <Badge
                    variant={member.role === "Admin" ? "secondary" : "outline"}
                    className="font-normal"
                  >
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell className="py-5 px-6">
                  <span className="text-sm text-gray-700">{member.joined}</span>
                </TableCell>
                <TableCell className="text-right py-5 px-6">
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
