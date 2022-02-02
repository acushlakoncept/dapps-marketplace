import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Loader, Message } from "@components/ui/common";
import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { OrderModal } from "@components/ui/order";
import { getAllCourses } from "@content/courses/fetcher";
import { useState } from "react";

export default function Marketplace({courses}) {
  const { web3, contract, requireInstall } = useWeb3();
  const {hasConnectedWallet, account, isConnecting} = useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account.data);
  const [selectedCourse, setSelectedCourse] = useState(null);

    const purchaseCourse = async order => {
      const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);
      
      const orderHash = web3.utils.soliditySha3(
        { type: "bytes16", value: hexCourseId },
        { type: "address", value: account.data}
        );
      const emailHash = web3.utils.soliditySha3(order.email)
      // const emailHash = web3.utils.sha3(order.email)
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
        <MarketHeader />
        <CourseList courses={courses}>
          {course => 
            <CourseCard
              key={course.id} 
              course={course}
              disabled={!hasConnectedWallet} 
              Footer={() => {

                 if(requireInstall) {
                   return (
                    <Button 
                    variant="lightPurple"
                    disabled={true}
                    >
                      Install
                    </Button>
                   )
                 }

                 if(isConnecting) {
                    return (
                      <Button 
                      variant="lightPurple"
                      disabled={true}
                      >
                        <Loader size="sm" />
                      </Button>
                    )
                 }

                 if(!ownedCourses.hasInitialResponse) {
                  return (
                    <div style={{height: "50px"}} />
                  )
                 }

                 const owned = ownedCourses.lookup[course.id];
                 if(owned) {
                  return (
                    <>
                    <Button 
                    variant="green"
                    disabled={true}
                    >
                      Owned
                    </Button>
                    <div className="mt-1">
                    { owned.state === "activated" &&
                      <Message size="sm">
                        Activated
                      </Message>
                    }
                    { owned.state === "purchased" &&
                      <Message size="sm" type="warning">
                        Waiting for Activation
                      </Message>
                    }
                    { owned.state === "deactivated" &&
                      <Message size="sm" type="danger">
                        Deactivated
                      </Message>
                    }
                    </div>
                    </>
                  )
                 }

                 return (
                  <Button 
                  variant="lightPurple"
                  onClick={() => setSelectedCourse(course)}
                  disabled={!hasConnectedWallet}
                  >
                    Purchase
                  </Button>
                 )}
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