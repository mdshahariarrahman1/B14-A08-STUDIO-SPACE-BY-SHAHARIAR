import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/server-auth";
import { mongoDb } from "@/lib/mongodb";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.email) {
    return Response.json({ message: "Please sign in to cancel a booking." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "The submitted request was not valid JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("status" in body) ||
    body.status !== "Cancelled"
  ) {
    return Response.json({ message: "Only pending bookings can be cancelled." }, { status: 400 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ message: "Booking not found." }, { status: 404 });
  }

  const bookingId = new ObjectId(id);
  const email = user.email.trim().toLowerCase();
  let cancellationSaved = false;

  try {
    const bookings = mongoDb.collection("bookings");
    const result = await bookings.updateOne(
      {
        _id: bookingId,
        $or: [{ "user.email": email }, { userEmail: email }],
        status: "Pending",
      },
      {
        $set: {
          status: "Cancelled",
          bookingStatus: "Cancelled",
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return Response.json(
        { message: "This booking cannot be cancelled or does not belong to you." },
        { status: 404 },
      );
    }

    cancellationSaved = true;
    await mongoDb.collection("bookingSlots").deleteMany({ bookingId });
    const booking = await bookings.findOne({ _id: bookingId });
    if (!booking) {
      return Response.json({ message: "The cancelled booking could not be reloaded." }, { status: 500 });
    }

    return Response.json({
      ...booking,
      id: booking._id.toString(),
      _id: undefined,
      createdAt:
        booking.createdAt instanceof Date
          ? booking.createdAt.toISOString()
          : booking.createdAt,
      updatedAt:
        booking.updatedAt instanceof Date
          ? booking.updatedAt.toISOString()
          : booking.updatedAt,
    });
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    return Response.json(
      {
        message: cancellationSaved
          ? "The booking was cancelled, but its availability could not be refreshed. Please reload your bookings."
          : "The booking could not be cancelled. Please try again.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.email) {
    return Response.json({ message: "Please sign in to delete a booking." }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ message: "Booking not found." }, { status: 404 });
  }

  const bookingId = new ObjectId(id);
  const email = user.email.trim().toLowerCase();
  try {
    const result = await mongoDb.collection("bookings").deleteOne({
      _id: bookingId,
      $or: [{ "user.email": email }, { userEmail: email }],
    });

    if (result.deletedCount !== 1) {
      return Response.json(
        { message: "Booking not found or it does not belong to you." },
        { status: 404 },
      );
    }

    try {
      await mongoDb.collection("bookingSlots").deleteMany({ bookingId });
    } catch (error) {
      console.error("Booking was deleted, but its reserved slots could not be cleared:", error);
      return Response.json({
        message: "Booking deleted successfully.",
        availabilityUpdated: false,
      });
    }

    return Response.json({
      message: "Booking deleted successfully.",
      availabilityUpdated: true,
    });
  } catch (error) {
    console.error("Failed to delete booking:", error);
    return Response.json(
      { message: "The booking could not be deleted. Please try again." },
      { status: 500 },
    );
  }
}
