import Lecture from '@/components/Lecture'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const CreateLecture = () => {

  const [lectureTitle, setLectureTitle] = useState("")
  const navigate = useNavigate();
  const courseId = useParams().courseId;
  const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();
  const { data: lectureData, isLoading: lectureIsLoading, isError: lectureError, refetch } = useGetCourseLectureQuery(courseId);
  const createLectureHandler = async () => {
    console.log(lectureTitle);
    await createLecture({ lectureTitle, courseId })
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Lecture added to the course");
      refetch();
      setLectureTitle("")
    }
    if (error) {
      toast.error(error.data.message || "Unable to create lecture");
    }
  }, [isSuccess, error]);


  return (
    <div className='flex-1 mx-10'>
      <div className='mb-4'>
        <h1 className="font-bold text-xl">
          Lets add, edit lectures for your new course
        </h1>
        <p className="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
          laborum!
        </p>
      </div>
      <div className='space-y-4'>
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input
            type={"text"}
            name="courseTitle"
            placeholder="Your lecture name"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>

        <div className='flex gap-2'>
          <Button variant={"outline"} onClick={() => navigate(`/admin/course/${courseId}`)}>Back to course</Button>
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {
              isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Please Wait
                </>
              ) : (
                "Create Lecture"
              )
            }
          </Button>
        </div>
        <div className='mt-10'>
          {
            lectureIsLoading ? (<p>Loading Lecture...</p>) : (
              lectureError ? (
                <p>Failed to load lectures...</p>
              ) : (
                lectureData.lectures.length === 0 ? (
                  <p>No lectures available</p>
                ) : (
                  lectureData.lectures.map((lecture,index) => (
                    <Lecture
                      key={lecture._id}
                      lecture={lecture}
                      courseId={courseId}
                      index = {index}
                    />
                  ))
                )
              )
            )
          }
        </div>
      </div>

    </div>
  )
}

export default CreateLecture