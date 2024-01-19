'use server'

import { CreateEventParams, 
         DeleteEventParams, 
         GetAllEventsParams, 
         GetEventsByUserParams, 
         GetRelatedEventsByCategoryParams,
         UpdateEventParams} 
from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../Database"
import User from "../Database/models/user.model"
import Event from "../Database/models/event.model"
import Category from "../Database/models/category.model"
import { revalidatePath } from "next/cache"


const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}


const populateEvent = async (query: any) => {
    return query
    .populate({path: 'organizer', model: User, select: '_id FirstName LastName'})
    .populate({path: 'category', model: Category, select: '_id name'})

}

export const createEvent = async ({event, userId, path}:CreateEventParams)=>{
    try {
        await connectToDatabase();

        const organizer = await User.findById(userId)
        if(!organizer) {
            throw new Error (`Could not find organizer.`);
        }
            const newEvent = await Event.create({
                ...event,
                category: event.categoryId,
                organizer: userId,
            })

           return JSON.parse(JSON.stringify(newEvent))
        
    } catch (error) {
        handleError(error)
    }
}

export const getEventbyId = async (eventId:string)=>{
    try {
        await connectToDatabase();

        const getevent = await populateEvent(Event.findById(eventId))
        
        if(!getevent) {
            throw new Error(`Could not find event`); 
        }

        return JSON.parse(JSON.stringify(getevent))
    } catch (error) {
        handleError(error)
    }
}

export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
  try {
    await connectToDatabase()

    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const categoryCondition = category ? await getCategoryByName(category) : null
    const conditions = {
      $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
    }

    const skipAmount = (Number(page) - 1) * limit
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
//UPDATE 
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
    try {
      await connectToDatabase()
  
      const eventToUpdate = await Event.findById(event._id)
      if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
        throw new Error('Unauthorized or event not found')
      }
  
      const updatedEvent = await Event.findByIdAndUpdate(
        event._id,
        { ...event, category: event.categoryId },
        { new: true }
      )
      revalidatePath(path)
  
      return JSON.parse(JSON.stringify(updatedEvent))
    } catch (error) {
      handleError(error)
    }
  }
  

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
    try {
      await connectToDatabase()
  
      const deletedEvent = await Event.findByIdAndDelete(eventId)
      if (deletedEvent) revalidatePath(path)
    } catch (error) {
      handleError(error)
    }
  }

  // GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
    try {
      await connectToDatabase()
  
      const conditions = { organizer: userId }
      const skipAmount = (page - 1) * limit
  
      const eventsQuery = Event.find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
  
      const events = await populateEvent(eventsQuery)
      const eventsCount = await Event.countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
      handleError(error)
    }
  }
  
  // GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
  export async function getRelatedEventsByCategory({
    categoryId,
    eventId,
    limit = 3,
    page = 1,
  }: GetRelatedEventsByCategoryParams) {
    try {
      await connectToDatabase()
  
      const skipAmount = (Number(page) - 1) * limit
      const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }
  
      const eventsQuery = Event.find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
  
      const events = await populateEvent(eventsQuery)
      const eventsCount = await Event.countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
      handleError(error)
    }
  }
