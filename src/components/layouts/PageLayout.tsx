export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto"> {children}</div>;
}
