import { Center } from "@/components/center";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 flex justify-center">
      <Center>{children}</Center>
    </main>
  );
}
