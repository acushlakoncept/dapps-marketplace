import { useEthPrice } from "@components/hooks/useEthPrice";
import { useAccount, useNetwork, useWalletInfo } from "@components/hooks/web3";
import { Breadcrumbs, Button } from "@components/ui/common";
import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { OrderModal } from "@components/ui/order";
import { EthRates, WalletBar } from "@components/ui/web3";
import { getAllCourses } from "@content/courses/fetcher";
import { useState } from "react";

export default function Marketplace({courses}) {
  const [selectedCourse, setSelectedCourse] = useState(null);
    const {account, network, canPurchaseCourse} = useWalletInfo();
    
    const { eth } = useEthPrice();

  return (
      <>
        <div className="pt-4">
          <WalletBar 
            address={account.data}
            network={{
              data: network.data,
              target: network.target,
              isSupported: network.isSupported,
              hasInitialResponse: network.hasInitialResponse,
            }}
             /> 
            <EthRates eth={eth.data} ethPerItem={eth.perItem} />
            <div className="flex flex-row-reverse py-4 px-4 sm:px-6 lg:px-8">
              <Breadcrumbs />
            </div>
        </div>
        <CourseList courses={courses}>
          {course => 
            <CourseCard
              key={course.id} 
              course={course}
              disabled={!canPurchaseCourse} 
              Footer={() => 
              <div className="mt-4">
                <Button 
                variant="lightPurple"
                onClick={() => setSelectedCourse(course)}
                disabled={!canPurchaseCourse}
                >
                  Purchase
                </Button>
              </div>
                }
            />}
        </CourseList>
        { selectedCourse &&
          <OrderModal 
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
           />
        }
      </>
  )
}

export function getStaticProps() {
  const {data} = getAllCourses();
  return {
    props: {
      courses: data
    }
  }
}

Marketplace.Layout = BaseLayout;