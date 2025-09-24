import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const COURSE_API = "http://localhost:8080/api/v1/course/"

export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes:['Refetch_Creator_Course',"Refetch_Lecture"],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: "include"
    }),

    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: "/",
                method: "POST",
                body: { courseTitle, category }
            }),
            invalidatesTags: ['Refetch_Creator_Course']
        }),

        getCreatorCourse: builder.query({
            query: ()=>({
                url:"/",
                method: "GET",
            }),
            providesTags: ['Refetch_Creator_Course']
        }),

        editCourse: builder.mutation({
            query: ({formData, courseId}) => ({
                url:`/${courseId}`,
                method: "PUT",
                body: formData
            })
        }),

        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "GET"
            })
        }),

        createLecture: builder.mutation({
            query: ({lectureTitle,courseId}) => ({
                url: `/${courseId}/lecture`,
                method: "POST",
                body: {lectureTitle}
            })
        }),

        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: "GET",
            }),
            providesTags:['Refetch_Lecture']
        }),

        editLecture: builder.mutation({
            query: ({lectureTitle, videoInfo, isPreview,courseId,lectureId,})=>({
                url:`/${courseId}/lecture/${lectureId}`,
                method: "POST",
                body:{lectureTitle, videoInfo, isPreview}
            })
        }),

        removeLecture: builder.mutation({
            query: ({lectureId})=>({
                url:`/lecture/${lectureId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Refetch_Lecture']
        }),

        removeCourse: builder.mutation({
            query: ({courseId})=>({
                url:`/${courseId}`,
                method:"DELETE"
            })
        }),

        getLectureById: builder.query({
            query: (lectureId) => ({
                url:`/lecture/${lectureId}`,
                method:"GET"
            })
        }),

        editCoursePublish: builder.mutation({
            query: ({courseId, isPublished}) =>({
                url: `/${courseId}/publish`,
                method: "PUT",
                body: {isPublished}
            })
        }),

        getPublishedCourses: builder.query({
            query: () => ({
                url:"/courses/published",
                method:"GET"
            })
        }),

        getCourseDetail: builder.query({
            query: (courseId)=> ({
                url:`/course-detail/${courseId}`,
                method:"GET"
            })
        })

    })
})

export const {
    useCreateCourseMutation,
    useGetCreatorCourseQuery,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    useCreateLectureMutation,
    useGetCourseLectureQuery,
    useEditLectureMutation,
    useRemoveLectureMutation,
    useRemoveCourseMutation,
    useGetLectureByIdQuery,
    useEditCoursePublishMutation,
    useGetPublishedCoursesQuery,
    useGetCourseDetailQuery

} = courseApi;