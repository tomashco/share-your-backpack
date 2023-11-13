export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container prose mx-auto h-[80%] max-w-none p-4 md:w-full lg:w-[1024px]">
      {" "}
      {children}
    </div>
  );
}
