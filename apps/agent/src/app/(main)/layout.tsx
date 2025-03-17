import ResponsiveLayout from "./responsive-layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ResponsiveLayout>{children}</ResponsiveLayout>;
}
