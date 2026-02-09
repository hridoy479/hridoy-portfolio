import Header from "@/components/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Header />
      <div className="flex-1 md:ml-64 overflow-y-auto min-h-screen">
        {children}
      </div>
    </div>
  );
}
