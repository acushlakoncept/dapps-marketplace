import { useWalletInfo } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button } from "@components/ui/common";
import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { OrderModal } from "@components/ui/order";
import { getAllCourses } from "@content/courses/fetcher";
import { useState } from "react";

export default function Marketplace({courses}) {
  const { web3, contract } = useWeb3();
  const {canPurchaseCourse, account} = useWalletInfo();
  const [selectedCourse, setSelectedCourse] = useState(null);

    const purchaseCourse = async order => {
      const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);
      
      const orderHash = web3.utils.soliditySha3(
        { type: "bytes16", value: hexCourseId },
        { type: "address", value: account.data}
        );
      const emailHash = web3.utils.soliditySha3(order.email)
      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: orderHash },
        { type: "bytes32", value: emailHash },
      )

      const value = web3.utils.toWei(String(order.price), "ether");

      try {
        await contract.methods.purchaseCourse(
          hexCourseId, 
          proof
          ).send({ from: account.data, value });
      } catch  {
        console.log("Error purchasing course");
      }

    }
    
  return (
      <>
        <div className="py-4">
         <MarketHeader />
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
            onSubmit={purchaseCourse}
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