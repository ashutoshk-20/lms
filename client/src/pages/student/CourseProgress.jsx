import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator';
import { useAddDoubtMutation, useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi';
import { CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseProgress = () => {
    const isCompleted = true;
    const courseId =useParams().courseId;
    const {data,isLoading,isError,refetch} = useGetCourseProgressQuery(courseId);

    const [currentLecture, setCurrentLecture] = useState(null);

    const [updateLectureProgress] = useUpdateLectureProgressMutation();
    const [completeCourse,{data:markCompleteData, isSuccess:completedSuccess}] = useCompleteCourseMutation();
    const [inCompleteCourse,{data:markInCompleteData, isSuccess:inCompleteSuccess}] = useInCompleteCourseMutation();
    const [addDoubt,{data:doubtData}] = useAddDoubtMutation();


    
    if(isLoading) return <p>Loading...</p>
    if(isError) return <p>Failed to load course details</p>


    const {courseDetails, progress, completed} = data?.data;

    const {courseTitle} = courseDetails;

    const initalLecture = currentLecture || courseDetails.lectures && courseDetails.lectures[0];
    
    const isLectureCompleted = (lectureId) =>{
        return progress.some((prog) => prog.lectureId === lectureId && prog.viewed)
    }

    const handleSelectLecture = (lecture) => {
        setCurrentLecture(lecture)
    }

    const handleLectureProgress = async (lectureId) =>{
        await updateLectureProgress({courseId, lectureId});
        refetch();
    }

    const handleCompleteCourse = async () =>{
        await completeCourse(courseId);
        refetch();
        toast.success("Course marked as success")
    }

    const handleInCompleteCourse = async () =>{
        await inCompleteCourse(courseId);
        refetch();
        toast.success("Course in progress")
    }

    const handleClick = async () =>{
        await addDoubt({courseId,question:"Answer in a line about strength of next js"});
    }

    useEffect(()=>{
        if(doubtData) console.log(doubtData);
    },[doubtData])

    

    return (
        <div className='max-w-7xl mx-auto p-4 my-20'>
            {/* Display course name */}
            <div className='flex justify-between mb-4'>
                <h1 className="text-2xl font-bold">{courseTitle}</h1>
                <Button onClick={completed ? handleInCompleteCourse : handleCompleteCourse} className={completed ? "bg-green-500" : "bg-black"}>
                    {
                        completed ? (
                            <div className='flex gap-2 items-center'>
                                <CheckCircle/>
                                <span >Completed</span>
                            </div>
                        ) : "Mark as completed"
                    }
                </Button>
            </div>

            <div className='flex flex-col md:flex-row gap-6'>
                {/* Video section */}
                <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
                    <div className="">
                        {/* video */}
                        <video
                            src={currentLecture?.videoUrl || initalLecture.videoUrl}
                            controls
                            className='w-full h-auto md:rounded-lg'
                            onPlay={() => handleLectureProgress(currentLecture?._id || initalLecture._id)}
                        />
                    </div>
                    <div className="mt-4">
                        <h3 className='font-medium text-lg'>
                            {
                                `Lecture - ${courseDetails.lectures.findIndex((lec) => lec._id === (currentLecture?._id || initalLecture._id))+1} : ${currentLecture?.lectureTitle || initalLecture.lectureTitle}`
                            }
                        </h3>
                    </div>

                    <Separator className={'mt-4'}/>
                    <div className='mt-4'>
                            <h1 className='font-bold text-lg md:text-xl'>Doubts</h1>
                            <Button onClick={handleClick}>Ask</Button>
                    </div>
                </div>

                <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0" >
                    <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
                    <div className="flex-1 overflow-y-auto">
                        {
                            courseDetails.lectures.map((lecture, idx) => (
                                <Card 
                                key={idx} 
                                className={`mb-3 hover:cursor-pointer transition transform ${lecture._id === currentLecture?._id ? "bg-gray-200" : "dark:bg-gray-600"}`} 
                                onClick={() => handleSelectLecture(lecture)}>
                                    <CardContent className={"flex items-center justify-between p-4"}>
                                        <div className="flex items-center">
                                            {
                                                isLectureCompleted(lecture._id) ? (
                                                    <CheckCircle2 size={24} className='text-green-500 mr-2' />
                                                ) : (
                                                    <CirclePlay size={24} className='text-gray-500 mr-2' />
                                                )
                                            }
                                            <div>
                                                <CardTitle className={"text-lg font-medium"}>
                                                    {lecture.lectureTitle}
                                                </CardTitle>
                                            </div>

                                        </div>
                                        {
                                            isLectureCompleted(lecture._id) && (

                                                <Badge variant={'outline'} className={"bg-green-200 text-green-600"}>
                                                    Completed
                                                </Badge>
                                            )
                                        }
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseProgress