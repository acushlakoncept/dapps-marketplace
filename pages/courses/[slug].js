import { useAccount, useOwnedCourse } from "@components/hooks/web3";
import { Message, Modal } from "@components/ui/common";
import {
  CourseHero,
  Curriculum,
  Keypoints
} from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";

export default function Course({course}) {

  const { account } = useAccount();
  const { ownedCourse } = useOwnedCourse(course, account.data);
  const courseState = ownedCourse.data?.state;

  return (
    <>
      <div className="py-4">
        <CourseHero 
          hasOwner={!!ownedCourse.data}
          title={course.title}
          description={course.description}
          image={course.coverImage} />
      </div>
      <Keypoints
        points={course.wsl}
       />
       <div className="max-w-5xl mx-auto">
       { courseState === "purchased" && 
          <Message type="warning">
            Course is purchased and waiting for activation. Process can take up to 24 hours.
            <i className="block font-normal">Incase of any questions, please contact info@acushlakoncept.com</i>
          </Message>
       }
       { courseState === "activated" && 
          <Message>
            Acushla Innovations wishes you a happy learning experience.
          </Message>
       }
       { courseState === "deactivated" && 
          <Message type="danger">
            Course has been deactivated, due to an incorrect purchase data.
            The functionality to watch the course has been temporaly disabled.
            <i className="block font-normal">Incase of any questions, please contact info@acushlakoncept.com</i>
          </Message>
       }
       </div>
      <Curriculum locked={true} />
      <Modal />
    </>
  )
}

export function getStaticPaths() {
  const { data } = getAllCourses()

  return {
    paths: data.map(c => ({
      params: {
        slug: c.slug
      }
    })),
    fallback: false
  }
}


export function getStaticProps({params}) {
  const { data } = getAllCourses()
  const course = data.filter(c => c.slug === params.slug)[0]
  console.log(course);
  return {
    props: {
      course
    }
  }
}

Course.Layout = BaseLayout;