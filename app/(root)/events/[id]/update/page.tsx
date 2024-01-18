import EventForm from "@/components/shared/EventForm"
import { getEventbyId } from "@/lib/actions/events.actions";
import { UpdateEventParams, UpdateUserParams } from "@/types";
import { auth } from "@clerk/nextjs";

type UpdateEventProps = {
  params: {
    id: string
  }

}

const UpdateEvent = async ({params : { id}}: UpdateEventProps) => {
  const {sessionClaims} = auth();
  const userId = sessionClaims?.userId as string;
    const event = await getEventbyId(id);
  return (
    <>
    <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Update Event</h3>
    </section>
    <div className="wrapper my-9">
        <EventForm type="Update" event={event} eventId={event._id} userId={userId}></EventForm>
    </div>
    </>
  )
}

export default UpdateEvent
