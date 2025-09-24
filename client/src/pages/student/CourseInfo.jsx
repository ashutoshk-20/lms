import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useGetCourseDetailQuery } from '@/features/api/courseApi'
import { BadgeInfo, Lock, PlayCircle } from 'lucide-react'
import React from 'react'
import { useParams } from 'react-router-dom'

const CourseInfo = () => {

  const enrolledCourse = false;
  const courseId = useParams().courseId;
  const {data} = useGetCourseDetailQuery(courseId)
  console.log(data)
  return (
    <div className='my-20 space-y-5'>
      <div className='bg-[#2D2F31] text-white'>
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className='font-bold text-2xl md:text-3xl'>{data?.course?.courseTitle}</h1>
          <p className='text-base md:text-lg'>{data?.course?.subTitle}</p>

          <p>Created by{" "} <span className='text-[#C0C4FC] underline italic'>{data?.course?.creator?.name}</span></p>
          <div className='flex items-center gap-2 text-sm'>
            <BadgeInfo size={16}/>
            <p>Last updated {data?.course?.updatedAt.split("T")[0]}</p>
          </div>
          <p>Student enrolled : {data?.course?.enrolledStudents?.length}</p>
        </div>
      </div>

      <div>
        <div>
          <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
            {/* Left */}
            <div className="w-full lg:w-1/2 space-y-5">
              <h1 className='font-bold text-xl md:text-2xl'>Description</h1>
              <p className='text-sm' dangerouslySetInnerHTML={{__html:data?.course?.description}}/>
              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>
                    {data?.course?.lectures.length} lectures
                  </CardDescription>
                </CardHeader>
                <CardContent className={"space-y-3"}>
                  {
                    data?.course?.lectures.map((lecture,index) => (
                      <div key={index} className='flex items-center gap-3 text-sm'>
                        <span>
                          {
                            true ? (
                              <PlayCircle size={14}/>
                            ) : (
                              <Lock size={14}/>
                            )
                          }
                        </span>
                        <p>{lecture.lectureTitle}</p>
                      </div>
                    ))
                  }
                </CardContent>
              </Card>
            </div>
            {/* Right */}
            <div className='w-full lg:w-1/3'>
                  <Card>
                    <CardContent className={"p-4 flex flex-col"}>
                      <div className='w-full aspect-video mb-4'>
                        Video loading
                      </div>
                      <Separator className={"my-4"}/>
                      <h1 className='font-bold text-lg md:text-xl -mb-6'>Lecture title</h1>
                      
                    </CardContent>
                    <CardFooter className={"flex justify-center p-4"}>
                      <Button className={"w-full"}>
                        {
                          enrolledCourse ? "Continue":"Enroll"
                        }
                      </Button>
                    </CardFooter>
                  </Card>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default CourseInfo