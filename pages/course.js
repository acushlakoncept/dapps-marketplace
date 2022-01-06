import Modal from "@components/common/modal";
import { CourseHero, Curriculum, Keypoints } from "@components/course";
import { BaseLayout } from "@components/layout";

export default function Course() {
  
    return (
      <BaseLayout>
        <div className="py-12">
        <CourseHero />
        </div>
        <Keypoints />
        <Curriculum />
        <Modal />
      </BaseLayout>
    )
  }