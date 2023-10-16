export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto h-[80%] p-4"> {children}</div>;
}
