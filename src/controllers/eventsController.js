const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {db} = require('../lib/db');

var moment = require('moment'); // require

/*
const {
    CreateEventParams,
    UpdateEventParams,
    DeleteEventParams,
    GetAllEventsParams,
    GetEventsByUserParams,
    GetRelatedEventsByCategoryParams,
  } = require('../types/index');
*/

// GET ONE EVENT BY ID
exports.getEventById= async (req, res) => {
  try{
    console.log("BODY:-", req.body.data);
    const { id } = req.body.data;

    const category = await db.event.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
        organizer: true
      }
    });

    res.status(200).send({
      data: category
    });

  } catch(error) {
    
    res.status(500).send({
      error,
    });

  }
}

// GET ALL EVENTS BY ID
exports.getAllEventsById= async (req, res) => {
  try{

    console.log("All Events params: ", req.body);
    const {limit, page, userId} = req.body;

    const skipAmount = (Number(page) - 1) * limit;

    console.log("Skip Amount: ", skipAmount); 

      const allEvents = await db.event.findMany({
          where: {
            organizerId: userId
          }
      });

      const events = await db.event.findMany({
        where: {
          organizerId: userId 
        },
        include: {
            category: true,
            organizer: true
          },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        skip: skipAmount,
        take: limit,
      });

      //console.log("Events:-", allEvents.length);
      //const events = await populateEvent(eventsQuery)
      const eventsCount = allEvents.length;

      res.status(200).send({
        data: events,
        totalPages: Math.ceil(eventsCount / limit),
      });
      
  } catch (error) {

    res.status(500).send({
      error,
    });

  }

}

 // GET ALL EVENTS
 exports.getAllEvents = async (req, res) => {

  try{

    console.log("Get all events: ", req.body);
    const {query, limit, page, category, eventId} = req.body;

    const skipAmount = (Number(page) - 1) * limit;

    console.log("Skip Amount: ", skipAmount); 

    if(category && eventId){

      const allEvents = await db.event.findMany({
        where: {
          OR: [
            {
              categoryId: category 
            },
          ],
          NOT: {
            id: eventId,
          }, 
        }
      });

      const events = await db.event.findMany({
        include: {
            category: true,
            organizer: true
          },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        skip: skipAmount,
        take: limit,
        where: {
          OR: [
            {
              categoryId: category 
            },
          ],
          NOT: {
            id: eventId,
          }, 
        }
      });

      //console.log("Events:-", allEvents.length);
      //const events = await populateEvent(eventsQuery)
      const eventsCount = allEvents.length;

      res.status(200).send({
        data: events,
        totalPages: Math.ceil(eventsCount / limit),
      });
      
    } else {
      const allEvents = await db.event.findMany();
      const events = await db.event.findMany({
        include: {
            category: true,
            organizer: true
          },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        skip: skipAmount,
        take: limit
      });

      //console.log("Events:-", allEvents.length);
      //const events = await populateEvent(eventsQuery)
      const eventsCount = allEvents.length;

      res.status(200).send({
        data: events,
        totalPages: Math.ceil(eventsCount / limit),
      });
    }
    

    

  } catch (error) {

    res.status(500).send({
      error,
    });

  }

}

exports.getEvents = async (req, res) => {
    
    try {
        //const id = req.params._id;

        const events = await db.event.findMany();

        if (!events) {
            return res.status(404).send({
               message: 'Nothing found',
            });
        }

        res.status(200).send({
            data: events,
        });

    } catch (error) {

        res.status(500).send({
            error,
        });
    }
}
/* New Event Call */
exports.newEvent = async (req, res) => {
try {
    console.log("BODY:-",req.body);
    const { eventTitle, catName, description, location, imageUrl, startDate, endDate, price, freeEvent, webAddress, organizerId, categoryId } = req.body;
    
    /*
    const user = await User.findOne({ email });

    if (user) {
        return res.status(400).send({
            message: 'User already exists',
        });
    }
    moment.utc(category?.startDateTime).format('YYYY-MM-DDTHH:MM')
    */

    const newCategory = await db.event.create({
        data: {
            title: eventTitle,
            description: description,
            location: location,
            imageUrl: imageUrl,
            startDateTime: startDate,
            endDateTime: endDate,
            price: price,
            isFree: freeEvent,
            url: webAddress,
            organizerId: organizerId,
            categoryId: categoryId
        }
    });

    //await newUser.save();

    res.status(201).send({
        data: newCategory,
    });
} catch (error) {
    res.status(500).send({
        status: 500,
        error: error.message,
    });
}
}

/* Edit or Update Call */
exports.editEvent = async (req, res) => {
  try {
      console.log("BODY:-",req.body);
      const { eventId, eventTitle, catName, description, location, imageUrl, startDate, endDate, price, freeEvent, webAddress, organizerId, categoryId } = req.body;
  
      const updateEvent = await db.event.update({
        where: {
          id: eventId,
        },
          data: {
              title: eventTitle,
              description: description,
              location: location,
              imageUrl: imageUrl,
              startDateTime: startDate,
              endDateTime: endDate,
              price: price,
              isFree: freeEvent,
              url: webAddress,
              organizerId: organizerId,
              categoryId: categoryId
          }
      });
  
      //await newUser.save();
  
      res.status(201).send({
          data: updateEvent,
      });
  } catch (error) {
      res.status(500).send({
          status: 500,
          error: error.message,
      });
  }
}

exports.getCategoryByName = async (req, res) => {
    try{
      console.log("BODY:-",req.body);
      const { id } = req.body.data;
  
      //return db.category.findOne({ name: { $regex: name, $options: 'i' } })
      const category = await db.category.findUnique({
        where: {
          id: id,
        },
      });
  
      console.log("CATE:-", category);
  
      res.status(200).send({
        data: category,
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        error: error.message,
      });
     
    }


}

 // DELETE
 exports.deleteEvent = async (req, res) => {

    try{
      console.log("BODY:-",req.body);
      const { eventId } = req.body;
    
      //return db.category.findOne({ name: { $regex: name, $options: 'i' } })
      const category = await db.event.delete({
        where: {
          id: eventId,
        },
      });
    
      console.log("CATE:-", category);
    
      res.status(200).send({
        data: category,
      });

    } catch(error) {

        res.status(500).send({
          status: 500,
          error: error.message,
        });
        
    }
}
  

  /*
 const populateEvent = (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate({ path: 'category', model: Category, select: '_id name' })
}
  
  
  // CREATE
  export async function createEvent({ userId, event, path }: CreateEventParams) {
    try {
      await connectToDatabase()
  
      const organizer = await User.findById(userId)
      if (!organizer) throw new Error('Organizer not found')
  
      const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId })
      revalidatePath(path)
      
      return JSON.parse(JSON.stringify(newEvent))
    } catch (error) {
      handleError(error)
    }
  }
  
  // GET ONE EVENT BY ID
  export async function getEventById(eventId: string) {
    try {
      await connectToDatabase()
  
      const event = await populateEvent(Event.findById(eventId))
  
      if (!event) throw new Error('Event not found')
  
      return JSON.parse(JSON.stringify(event))
    } catch (error) {
      handleError(error)
    }
  }
  
  // UPDATE
  export async function updateEvent({ userId, event, path }: UpdateEventParams) {
    try {
      await connectToDatabase()
  
      console.log("Event:-",event)
  
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
  
  // GET ALL EVENTS
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
  */