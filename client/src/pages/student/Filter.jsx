import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'

const categories = [
    { id: "nextjs", label: "Next JS" },
    { id: "data science", label: "Data Science" },
    { id: "frontend development", label: "Frontend Development" },
    { id: "fullstack development", label: "Fullstack Development" },
    { id: "mern stack development", label: "MERN Stack Development" },
    { id: "backend development", label: "Backend Development" },
    { id: "javascript", label: "Javascript" },
    { id: "python", label: "Python" },
    { id: "docker", label: "Docker" },
    { id: "mongodb", label: "MongoDB" },
    { id: "html", label: "HTML" },
];


const Filter = ({ handleFilterChange }) => {

    const [selectedCategories, setSelectedCategories] = useState([]);


    const handleCategoryChange = (categoryLabel) => {
        setSelectedCategories((prevCategories) => {
            const newCategories = prevCategories.includes(categoryLabel) ? prevCategories.filter((id) => id !== categoryLabel) : [...prevCategories, categoryLabel]
            
            handleFilterChange(newCategories);
            return newCategories;
        });
    };


    return (
        <div className='w-full md:w-[20%]'>
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-lg md:text-xl">
                    Filter Options
                </h1>
            </div>
            <Separator className={"my-4"} />
            <div>
                <h1 className='font-semibold mb-2'>Category</h1>
                {
                    categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2 my-2">
                            <Checkbox
                                id={category.id}
                                onCheckedChange={() => handleCategoryChange(category.label)}
                            />
                            <Label htmlFor={category.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {category.label}
                            </Label>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Filter