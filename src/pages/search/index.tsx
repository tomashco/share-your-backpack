import type { NextPage } from "next";
import { api } from "@/utils/api";
import RootLayout from "@/components/layouts/RootLayout";
import { Header } from "@/components/header";
import PageLayout from "@/components/layouts/PageLayout";
import { useRouter } from "next/router";
import Link from "next/link";

const SearchPage: NextPage = () => {
  const router = useRouter();
  const searchValue = router.query.value as string;

  const { data: searchResults } = api.packs.search.useQuery({
    value: searchValue,
  });

  if (!searchResults) return <div>404</div>;

  return (
    <RootLayout>
      <Header
        pageTitle={
          <>
            <span className="text-sagegreen">Search</span>&nbsp; Results
          </>
        }
      />
      <PageLayout>
        {searchResults.map((result) => (
          <div key={result.id}>
            <div className="prose">
              <h1>
                <Link href={`/pack/${result.id}`}>{result.name}</Link>
              </h1>
              <p>{result.description}</p>
            </div>
          </div>
        ))}
      </PageLayout>
    </RootLayout>
  );
};

export default SearchPage;
