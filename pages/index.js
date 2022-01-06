import { Breadcrumbs, Hero, EthRates, WalletBar} from "@components/common";
import { CourseList } from "@components/course";
import { BaseLayout } from "@components/layout";
import { OrderCard } from "@components/order";

export default function Home() {
  return (
      <BaseLayout>
        <Hero />
        <Breadcrumbs />
        <EthRates />
        <WalletBar />
        <OrderCard />
        <CourseList />
      </BaseLayout>
  )
}