import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Loader } from "@components/ui/common";
import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { OrderModal } from "@components/ui/order";
import { getAllCourses } from "@content/courses/fetcher";
import { withToast } from "@utils/toast";
import { useState } from "react";


export default function Marketplace({courses}) {
  const { web3, contract, requireInstall } = useWeb3();
  const {hasConnectedWallet, account, isConnecting} = useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account.data);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isNewPurchase, setIsNewPurchase] = useState(true);

  const purchaseCourse = async order => {
    const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);
    
    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data}
      );
      
      const value = web3.utils.toWei(String(order.price), "ether");
      
      if(isNewPurchase) {
      const emailHash = web3.utils.soliditySha3(order.email)
      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: orderHash },
        { type: "bytes32", value: emailHash },
      )
      withToast(_purchaseCourse(hexCourseId, proof, value));
    } else {
      withToast(_repurchaseCourse(orderHash, value))
    }

  }

  const _purchaseCourse = async (hexCourseId, proof, value) => {
    try {
      const result = await contract.methods.purchaseCourse(
        hexCourseId, 
        proof
        ).send({ from: account.data, value });
        return result;
    } catch(error)  {
      throw new Error(error.message)
      // console.log("Error purchasing course");
    }
  }

  const _repurchaseCourse = async (courseHash, value) => {
    try {
      const result = await contract.methods.repurchaseCourse(
        courseHash
        ).send({ from: account.data, value });
        return result;
     } catch(error)  {
       throw new Error(error.message)
      // console.log("Error purchasing course");
    }
  }

return (
    <>
      <MarketHeader />
      <CourseList courses={courses}>
        {course => {
          const owned = ownedCourses.lookup[course.id];
          return (
            <CourseCard
              key={course.id} 
              course={course}
              state={owned?.state}
              disabled={!hasConnectedWallet} 
              Footer={() => {

                if(requireInstall) {
                  return (
                    <Button
                    size="sm"
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
                      size="sm"
                      variant="lightPurple"
                      disabled={true}
                      >
                        <Loader size="sm" />
                      </Button>
                    )
                }

                if(!ownedCourses.hasInitialResponse) {
                  return (
                    <div style={{height: "42px"}} />
                  )
                }

                
                if(owned) {
                  return (
                    <>
                    <div className="flex">
                    <Button 
                    onClick={() => alert('You are owner of this course!')}
                    size="sm"
                    variant="white"
                    disabled={false}
                    >
                      Yours &#10004;
                    </Button>
                    { owned.state === "deactivated" && 
                      <div className="ml-1">
                        <Button 
                        size="sm"
                        variant="purple"
                        disabled={false}
                        onClick={() => {
                          setIsNewPurchase(false);
                          setSelectedCourse(course);
                        }}
                        >
                          Fund to Activate
                        </Button>
                      </div>
                    }
                    </div>
                    </>
                  )
                }

                return (
                  <Button 
                  size="sm"
                  variant="lightPurple"
                  onClick={() => setSelectedCourse(course)}
                  disabled={!hasConnectedWallet}
                  >
                    Purchase
                  </Button>
                )}
                }
            />
            )}
        }
      </CourseList>
      { selectedCourse &&
        <OrderModal
          onSubmit={purchaseCourse}
          course={selectedCourse}
          isNewPurchase={isNewPurchase}
          onClose={() => {
            setSelectedCourse(null);
            setIsNewPurchase(true);
          }}
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