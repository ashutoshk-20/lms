import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const MEDIA_API = "http://localhost:8080/api/v1/media"

const LectureTab = () => {

    const [lectureTitle, setLectureTitle] = useState("");
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isPreview, setIsPreview] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisable, setBtnDisable] = useState(true);
    const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
    const [removeLecture, { isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation()
    const params = useParams();
    const { courseId, lectureId } = params;
    const navigate = useNavigate();

    const {data:lecturData, refetch} = useGetLectureByIdQuery(lectureId);
    const lecture = lecturData?.lecture;

    useEffect(() => {
        if(lecture){
            setLectureTitle(lecture.lectureTitle);
            setIsPreview(lecture.isPreview);
            setUploadVideoInfo({
                videoUrl: lecture.videoUrl,
                publicId: lecture.publicId
            });
        }
    },[lecture])

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total))
                    }
                });

                console.log(res);
                if (res.data.succes) {
                    setUploadVideoInfo({
                        videoUrl: res.data.data.url,
                        publicId: res.data.data.public_id
                    });
                    setBtnDisable(false);
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.log(error)
                toast.error("Video upload failed");
            } finally {
                setMediaProgress(false);
            }
        }
    }

    const editLectureHandler = async () => {
        await editLecture({ lectureTitle, videoInfo: uploadVideoInfo, isPreview, courseId, lectureId })
    }

    const removeLectureHandler = async () => {
        removeLecture({ lectureId });
    }



    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message);
            refetch();
        }
        if (error) {
            console.log(error.data.message)
            toast.error(error.data.message);
        }
    }, [isSuccess, error])

    useEffect(() => {
        if (removeSuccess) {
            toast.success("Data removed successfully");
            navigate(`/admin/course/${courseId}/lecture`)
        }
    }, [removeSuccess])

    return (
        <Card>
            <CardHeader className={"flex justify-between"}>
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>Make changes and click save when done</CardDescription>
                </div>
                <div>
                    <Button
                        variant="destructive"
                        className={"flex items-center gap-2"}
                        onClick={removeLectureHandler}
                        disabled={removeLoading}
                    >
                        {
                            removeLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </>
                            ) : "Remove Lecture"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className='space-y-1.5'>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        placeholder="Ex. introduction to Javascript"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                    />
                </div>
                <div className='space-y-1.5'>
                    <Label>Video <span className='text-red-500'>*</span></Label>
                    <Input
                        type="file"
                        placeholder="Ex. introduction to Javascript"
                        className={"w-fit"}
                        accept="video/*"
                        onChange={fileChangeHandler}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch checked={isPreview} onCheckedChange={setIsPreview} id="isPreview" />
                    <Label htmlFor="isPreview">Preview</Label>
                </div>
                {
                    mediaProgress && (
                        <div className='my-4'>
                            <Progress value={uploadProgress} />
                            <p>{uploadProgress}% uploaded</p>
                        </div>  
                    )
                }
                <div>
                    <Button disabled={isLoading} onClick={editLectureHandler}>
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </>
                            ) : "Update Lecture"
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default LectureTab