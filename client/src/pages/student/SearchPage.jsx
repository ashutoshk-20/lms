import React, { useState } from 'react'
import Filter from './Filter'
import { CourseSkeleton } from './Courses';
import SearchResult from './SearchResult';
import { AlertCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGetSearchCourseQuery } from '@/features/api/courseApi';

const SearchPage = () => {

    const [searchParams] = useSearchParams();

    const searchQuery = searchParams.get("query");

    const [selectedCategories, setSelectedCategories] = useState([]);
    

    const {data,isLoading} = useGetSearchCourseQuery({
        searchQuery,
        categories: selectedCategories
    });
    
    const isEmpty = !isLoading && data?.courses.length === 0;
    const handleFilterChange = (categories) => {
        setSelectedCategories(categories)
    }
  return (
    <div className='max-w-7xl mx-auto p-4 md:p-8'>
        <div className="my-10">
            <h1 className='font-bold text-xl md:text-2xl'>result for "{searchQuery}"</h1>
            <p>Showing result for {" "}
                <span className='text-blue-800 font-bold italic'>{searchQuery}</span>
            </p>
        </div>
        <div className="flex flxe-col md:flex-row gap-10">
            <Filter handleFilterChange={handleFilterChange}/>
            <div className="flex-1">
                    {
                        isLoading ? (
                            Array.from({length:3}).map((_,idx) => (
                                <CourseSkeleton key={idx}/>
                            ))
                        ) : (
                            isEmpty ? (<CourseNotFound/>) : (
                                data?.courses.map((course,idx) => <SearchResult course={course} key={idx}/>)
                            )
                        )
                    }
            </div>
        </div>
    </div>
  )
}

export default SearchPage

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
        Course Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
        Sorry, we couldn't find the course you're looking for.
      </p>
      <Link to="/" className="italic">
        <Button variant="link">Browse All Courses</Button>
      </Link>
    </div>
  );
};