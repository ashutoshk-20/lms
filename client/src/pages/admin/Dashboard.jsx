import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetCreatorCourseQuery } from '@/features/api/courseApi'
import React from 'react'

const Dashboard = () => {

  const { data } = useGetCreatorCourseQuery()
  const courses = data && data.courses;

  return (
    <div className='space-y-5'>
      <h1 className='font-bold text-xl md:text-2xl lg:text-3xl'>Enrollment status for each course</h1>
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {
          courses?.length === 0 ? <>
            <p className='text-red-400 text-sm md:text-lg lg:text-xl'>No publihsed courses...</p>
          </>:
          
          (courses?.map((course, idx) => course.isPublished && (
            <Card key={idx} className={"shadow-lg hover:shadow-2xl transition-shadow duration-300"} >
              <CardHeader>
                <CardTitle className={'truncate'}>{course.courseTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-3xl font-bold text-blue-600'>{course.enrolledStudents.length}</p>
              </CardContent>
            </Card>
          )))
        }
      </div>
    </div>
  )
}

export default Dashboard