import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/server-auth";
import { mongoDb } from "@/lib/mongodb";
import { getStudioById } from "@/lib/studios-server";
import {
  BOOKING_START_SLOTS,
  type BookingRequest,
} from "@/lib/bookings";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseBookingRequest(value: unknown): BookingRequest | null {
  if (!isRecord(value)) return null;

  const { studioId, date, startTime, durationHours } = value;
  if (
    typeof studioId !== "string" ||
    !studioId.trim() ||
    studioId.length > 128 ||
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(Date.parse(`${date}T00:00:00.000Z`)) ||
    new Date(`${date}T00:00:00.000Z`).toISOString().slice(0, 10) !== date ||
    typeof startTime !== "string" ||
    !BOOKING_START_SLOTS.some((slot) => slot === startTime) ||
    typeof durationHours !== "number" ||
    !Number.isInteger(durationHours) ||
    durationHours < 1 ||
    durationHours > 8
  ) {
    return null;
  }

  return { studioId: studioId.trim(), date, startTime, durationHours };
}

function getHourSlots(startTime: string, durationHours: number): number[] {
  const [hours, minutes] = startTime.split(":").map(Number);
  const startHour = hours + minutes / 60;

  return Array.from({ length: durationHours }, (_, index) => startHour + index);
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.email) {
    return Response.json({ message: "Please sign in to view your bookings." }, { status: 401 });
  }

  try {
    const bookings = await mongoDb
      .collection("bookings")
      .find({
        $or: [
          { "user.email": user.email.trim().toLowerCase() },
          { userEmail: user.email.trim().toLowerCase() },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      bookings: bookings.map((booking) => ({
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
      })),
    });
  } catch (error) {
    console.error("Failed to load bookings:", error);
    return Response.json(
      { message: "Bookings could not be loaded. Please try again." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.email) {
    return Response.json({ message: "Please sign in before booking a studio." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "The submitted booking was not valid JSON." }, { status: 400 });
  }

  const input = parseBookingRequest(body);
  if (!input) {
    return Response.json({ message: "Please check the booking date and time." }, { status: 400 });
  }

  if (input.date < new Date().toISOString().slice(0, 10)) {
    return Response.json({ message: "Booking dates must be today or later." }, { status: 400 });
  }

  const startMinutes = Number(input.startTime.slice(0, 2)) * 60;
  if (startMinutes + input.durationHours * 60 > 24 * 60) {
    return Response.json({ message: "The booking duration extends past midnight." }, { status: 400 });
  }

  let studio;
  try {
    studio = await getStudioById(input.studioId);
  } catch (error) {
    console.error("Failed to verify studio for booking:", error);
    return Response.json(
      { message: "The studio service is unavailable. Please try again later." },
      { status: 502 },
    );
  }

  if (!studio) {
    return Response.json({ message: "This studio could not be found." }, { status: 404 });
  }
  if (!studio.isAvailable) {
    return Response.json({ message: "This studio is not available for booking." }, { status: 409 });
  }
  if (
    !Number.isFinite(studio.hourlyRate) ||
    studio.hourlyRate <= 0 ||
    !Number.isFinite(studio.securityDeposit) ||
    studio.securityDeposit < 0
  ) {
    return Response.json(
      { message: "The studio price could not be verified. Please try again later." },
      { status: 502 },
    );
  }

  const slots = mongoDb.collection("bookingSlots");
  const bookingId = new ObjectId();
  const normalizedEmail = user.email.trim().toLowerCase();
  const date = input.date;

  try {
    await slots.createIndex(
      { studioId: 1, date: 1, hour: 1 },
      { unique: true, name: "unique_studio_booking_hour" },
    );

    await slots.insertMany(
      getHourSlots(input.startTime, input.durationHours).map((hour) => ({
        studioId: studio._id,
        date,
        hour,
        bookingId,
      })),
    );
  } catch (error) {
    await slots.deleteMany({ bookingId });
    if (isRecord(error) && error.code === 11000) {
      return Response.json(
        { message: "That time overlaps another reservation. Please choose another time." },
        { status: 409 },
      );
    }

    console.error("Failed to reserve booking time:", error);
    return Response.json(
      { message: "The booking could not be saved. Please try again." },
      { status: 500 },
    );
  }

  const hourlyRate = studio.hourlyRate;
  const securityDeposit = studio.securityDeposit;
  const total = hourlyRate * input.durationHours + securityDeposit;
  const now = new Date();
  const record = {
    _id: bookingId,
    bookingId: bookingId.toHexString(),
    studioId: studio._id,
    studioTitle: studio.title,
    studioImage: studio.imageUrl,
    studioCategory: studio.category,
    studio: {
      id: studio._id,
      title: studio.title,
      category: studio.category,
      location: studio.location,
      imageUrl: studio.imageUrl,
      hourlyRate,
      securityDeposit,
    },
    date,
    bookingDate: date,
    startTime: input.startTime,
    bookingTimeSlot: {
      startTime: input.startTime,
      endTime: `${String(
        Number(input.startTime.slice(0, 2)) + input.durationHours,
      ).padStart(2, "0")}:${input.startTime.slice(3, 5)}`,
      durationHours: input.durationHours,
    },
    durationHours: input.durationHours,
    hourlyRate,
    securityDeposit,
    total,
    totalPrice: total,
    status: "Pending" as const,
    bookingStatus: "Pending" as const,
    userName: user.name?.trim() || user.email,
    userEmail: normalizedEmail,
    ...(user.image ? { userImage: user.image } : {}),
    user: {
      id: user.id,
      name: user.name?.trim() || user.email,
      email: normalizedEmail,
      ...(user.image ? { image: user.image } : {}),
    },
    createdAt: now,
    updatedAt: now,
  };

  try {
    await mongoDb.collection("bookings").insertOne(record);
  } catch (error) {
    await slots.deleteMany({ bookingId });
    console.error("Failed to save booking record:", error);
    return Response.json(
      { message: "The booking could not be saved. Please try again." },
      { status: 500 },
    );
  }

  return Response.json(
    {
      ...record,
      id: bookingId.toString(),
      _id: undefined,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    { status: 201 },
  );
}
