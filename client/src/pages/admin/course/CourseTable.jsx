import { Button } from '@/components/ui/button'
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from 'react-router-dom'
import { useGetCreatorCourseQuery } from '@/features/api/courseApi'
import { Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const CourseTable = () => {
    const {data, isLoading} = useGetCreatorCourseQuery();
    const navigate = useNavigate();

    if(isLoading) return <h1>Loading...</h1>
    


    return (
        <div>
            <Button onClick={() => navigate("create")}>Create a new course</Button>
            <Table className="my-5">
                <TableCaption>A list of your courses</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Title</TableHead>
                        <TableHead className="w-[50px]">Status</TableHead>
                        <TableHead className="w-[50px] text-right">Action</TableHead>  
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.courses.map((course) => (
                        <TableRow key={course._id}>
                            <TableCell>{course.courseTitle}</TableCell>
                            <TableCell>
                                <Badge className={course.isPublished ? "bg-green-500" : "bg-gray-400"}>
                                    {
                                        course.isPublished ? "Published" : "Draft"
                                    }
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant={"ghost"} onClick={()=> navigate(`${course._id}`)}>
                                    <Edit size={4}/>
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CourseTable