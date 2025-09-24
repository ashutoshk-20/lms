import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditCourseMutation, useEditCoursePublishMutation, useGetCourseByIdQuery, useRemoveCourseMutation } from '@/features/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseTab = () => {
    const [isPublished, setIsPublished] = useState(false);
    const [lectures, setLectures] = useState([]);

    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        courseThumbnail: ""
    });

    const params = useParams();
    const courseId = params.courseId;

    const { data: courseByIdData, isLoading: courseByIdIsLoading } = useGetCourseByIdQuery(courseId,{refetchOnMountOrArgChange:true});
    const [editCoursePublish, {data:publishData,isLoading: publishLoading, isSuccess: publishSuccess, isError}] = useEditCoursePublishMutation();
    const [removeCourse,{isLoading:removeLoading, isSuccess:removeSuccess, error:removeError}] = useRemoveCourseMutation();

    useEffect(() => {
        
        if(courseByIdData?.course){
            const courseById = courseByIdData?.course;
            setInput({
                courseTitle: courseById?.courseTitle,
                subTitle: courseById?.subTitle,
                description: courseById?.description,
                category: courseById?.category,
                courseLevel: courseById?.courseLevel,
                courseThumbnail: "",
            });
            setIsPublished(courseById.isPublished);
            setLectures(courseById.lectures);
        }
    }, [courseByIdData])

    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const navigate = useNavigate();

    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value })
    }

    const selectCategory = (value) => {
        setInput({ ...input, category: value })
    }

    const selectLevel = (value) => {
        setInput({ ...input, courseLevel: value })
    }

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file })
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    }

    const handleEditCourse = async () => {
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);
        formData.append("courseThumbnail", input.courseThumbnail);

        await editCourse({ formData, courseId })
    }


    const handlerPublish = async () =>{
        
        const newStatus = !isPublished;
        setIsPublished(newStatus);
        
        await editCoursePublish({courseId, isPublished:newStatus});
        
    }

    const removeCourseHandler = async () => {
        await removeCourse({courseId});
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Course updated")
        }
        if (error) {
            toast.error(error.data.message || "Failed to update course");
        }
    }, [isSuccess, error]);

    useEffect(() => {
        if (publishSuccess){
            toast.success(`Course ${isPublished ? "published" : "unpublished"} successfully.`)
        }
        if(isError){
            toast.error("Error in publishing the course");
        }
    },[publishSuccess,isError]);

    useEffect(() => {
        if(removeSuccess){
            toast.success('Course removed successfully');
            navigate('/admin/course');
        }
        if(removeError){
            toast.error(removeError.data.message);
        }
    },[removeSuccess,removeError])

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make Changes to your courses here. Click save when your are done.
                    </CardDescription>
                </div>
                <div className='space-x-2'>
                    <Button variant={"outline"} onClick={handlerPublish} disabled={publishLoading || lectures.length === 0}>
                        {
                            !isPublished ?  "Publish" : (
                                publishLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4'/>
                                        Please wait..
                                    </>
                                ) : "Unpublish"
                            )
                        }
                    </Button>
                    <Button onClick={removeCourseHandler} disabled={removeLoading}>
                        Remove Course
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 mt-5">
                    <div className="space-y-1.5">
                        <Label htmlFor="courseTitle">Title</Label>
                        <Input
                            type="text"
                            name="courseTitle"
                            placeholder="Ex. Fullstack Developer"
                            value={input.courseTitle}
                            onChange={(e) => changeEventHandler(e)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="subTitle">Sub Title</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            placeholder="Ex. Become a full stack developer in 30 days"
                            value={input.subTitle}
                            onChange={(e) => changeEventHandler(e)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="description">Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className="flex items-center gap-5">
                        <div className='space-y-1.5'>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className='bg-white dark:bg-black dark:text-white'>
                                    <SelectGroup>
                                        <SelectLabel>Categories</SelectLabel>
                                        <SelectItem value="Next JS">Next JS</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Frontend Development">
                                            Frontend Development
                                        </SelectItem>
                                        <SelectItem value="Fullstack Development">
                                            Fullstack Development
                                        </SelectItem>
                                        <SelectItem value="MERN Stack Development">
                                            MERN Stack Development
                                        </SelectItem>
                                        <SelectItem value="Javascript">Javascript</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                        <SelectItem value="Docker">Docker</SelectItem>
                                        <SelectItem value="MongoDB">MongoDB</SelectItem>
                                        <SelectItem value="HTML">HTML</SelectItem></SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='space-y-1.5'>
                            <Label>Level</Label>
                            <Select onValueChange={selectLevel}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className='bg-white dark:bg-black dark:text-white'>
                                    <SelectGroup>
                                        <SelectLabel>Levels</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className='space-y-1.5'>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            className={"w-fit"}
                            onChange={selectThumbnail}
                        />
                        {
                            previewThumbnail && (
                                <img src={previewThumbnail} className='w-64 my-2' alt="Course Thumbnail" />
                            )
                        }
                    </div>
                    <div className='space-x-2'>
                        <Button onClick={() => navigate("/admin/course")} variant={"outline"}>Cancel</Button>
                        <Button disabled={isLoading} onClick={handleEditCourse}>
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Please wait
                                    </>
                                ) : (
                                    "Save"
                                )
                            }
                        </Button>
                    </div>

                </div>

            </CardContent>
        </Card>
    )
}

export default CourseTab