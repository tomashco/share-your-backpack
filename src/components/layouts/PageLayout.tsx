export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto h-[80%] p-4 md:w-full lg:w-[1024px]">
      {" "}
      {children}
    </div>
  );
}
