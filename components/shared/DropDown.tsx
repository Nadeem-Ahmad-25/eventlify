import React, { startTransition, useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { ICategory } from '@/lib/Database/models/category.model'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Input } from '../ui/input'
import { createCategory, getAllCategories } from '@/lib/actions/category.actions'

type DropDownTypes = {
    value?: string,
    onChangeHandler?: () => void
}



const DropDown = ({value , onChangeHandler}: DropDownTypes) => {
    const [categories, setCategories]= useState<ICategory[]>([])
    const [newCategory, setNewCategory]= useState("")

    const handleAddCategory = () => {
      createCategory({
        categoryName: newCategory.trim()
      })
        .then((category) => {
          setCategories((prevState) => [...prevState, category])
        })
    }
  
    useEffect(() => {
      const getCategories = async () => {
        const categoryList = await getAllCategories();
  
        categoryList && setCategories(categoryList as ICategory[])
      }
  
      getCategories();
    }, [])
  
  return (
        <Select onValueChange={onChangeHandler} defaultValue={value}>
           <SelectTrigger className="select-field">
            <SelectValue placeholder="Category" />
             </SelectTrigger>
            <SelectContent>
                {categories.length > 2 && categories.map((category)=>(
                    <SelectItem key={category._id} value={category._id} className='select-item p-regular-14'>
                        {category.name}
                    </SelectItem>
                ))}    
                    <AlertDialog>
                    <AlertDialogTrigger className='p-medium-14 flex rounded-sm w-full py-3 pl-8 text-primary-500 hover:bg-primary-50'>Add a new category</AlertDialogTrigger>
                    <AlertDialogContent className='bg-white'>
                    <AlertDialogHeader>
                    <AlertDialogTitle>New Category</AlertDialogTitle>
                    <AlertDialogDescription>
                    <Input className='input-field mt-3' type="text" placeholder='Category Name' onChange={(e)=>(setNewCategory(e.target.value))}></Input>
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>startTransition(handleAddCategory)}>Add</AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>

            </SelectContent>
        </Select>
  )
}

export default DropDown
