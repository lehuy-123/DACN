import Banner from "@/app/components/Banner";
import SearchForm from "@/app/components/SearchForm";
import PromotionSection from "@/app/components/PromotionSection";
import PopularRoutes from "@/app/components/PopularRoutes";

export default function HomePage() {
  return (
    <main>
      <Banner />
      <SearchForm />
      <PromotionSection />
      <PopularRoutes />
    </main>
  );
}
