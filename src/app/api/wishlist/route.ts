import { getCurrentUser } from "@/lib/server-auth";
import { mongoDb } from "@/lib/mongodb";
import { getStudioById, getStudios } from "@/lib/studios-server";
import type { IStudio } from "@/type";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseStudioId(value: unknown): string | null {
  if (!isRecord(value)) return null;
  const { studioId } = value;
  if (typeof studioId !== "string" || !studioId.trim() || studioId.length > 128) {
    return null;
  }
  return studioId.trim();
}

function getWishlistCollection() {
  return mongoDb.collection("wishlist");
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user?.email) {
    return Response.json(
      { message: "Please sign in to view your saved studios." },
      { status: 401 },
    );
  }

  const email = user.email.trim().toLowerCase();
  const studioId = new URL(request.url).searchParams.get("studioId")?.trim();
  const collection = getWishlistCollection();

  try {
    await collection.createIndex(
      { userEmail: 1, studioId: 1 },
      { unique: true, name: "unique_user_wishlist_studio" },
    );

    if (studioId) {
      const saved = await collection.findOne({ userEmail: email, studioId });
      return Response.json({ saved: Boolean(saved) });
    }

    const entries = await collection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    const studioIds = entries
      .map((entry) =>
        isRecord(entry) && typeof entry.studioId === "string"
          ? entry.studioId
          : null,
      )
      .filter((id): id is string => Boolean(id));

    if (studioIds.length === 0) {
      return Response.json({ studios: [] });
    }

    let studios: IStudio[];
    try {
      const allStudios = await getStudios();
      const byId = new Map(allStudios.map((studio) => [studio._id, studio]));
      // Keep them in wishlist order; drop studios that no longer exist on the backend.
      studios = studioIds
        .map((id) => byId.get(id))
        .filter((studio): studio is IStudio => Boolean(studio));
    } catch (error) {
      console.error("Failed to load studios for wishlist:", error);
      return Response.json(
        { message: "The studio service is unavailable. Please try again later." },
        { status: 502 },
      );
    }

    return Response.json({ studios });
  } catch (error) {
    console.error("Failed to load wishlist:", error);
    return Response.json(
      { message: "Your saved studios could not be loaded. Please try again." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.email) {
    return Response.json(
      { message: "Please sign in to save studios to your wishlist." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "The submitted request was not valid JSON." },
      { status: 400 },
    );
  }

  const studioId = parseStudioId(body);
  if (!studioId) {
    return Response.json(
      { message: "The studio could not be identified. Please try again." },
      { status: 400 },
    );
  }

  try {
    const studio = await getStudioById(studioId);
    if (!studio) {
      return Response.json(
        { message: "This studio could not be found." },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Failed to verify studio for wishlist:", error);
    return Response.json(
      { message: "The studio service is unavailable. Please try again later." },
      { status: 502 },
    );
  }

  const email = user.email.trim().toLowerCase();
  const collection = getWishlistCollection();

  try {
    await collection.createIndex(
      { userEmail: 1, studioId: 1 },
      { unique: true, name: "unique_user_wishlist_studio" },
    );

    await collection.insertOne({
      userEmail: email,
      studioId,
      createdAt: new Date(),
    });
  } catch (error) {
    if (isRecord(error) && error.code === 11000) {
      return Response.json(
        { message: "This studio is already in your wishlist." },
        { status: 409 },
      );
    }

    console.error("Failed to save wishlist entry:", error);
    return Response.json(
      { message: "The studio could not be saved. Please try again." },
      { status: 500 },
    );
  }

  return Response.json(
    { saved: true, message: "Studio saved to your wishlist." },
    { status: 201 },
  );
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user?.email) {
    return Response.json(
      { message: "Please sign in to manage your wishlist." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "The submitted request was not valid JSON." },
      { status: 400 },
    );
  }

  const studioId = parseStudioId(body);
  if (!studioId) {
    return Response.json(
      { message: "The studio could not be identified. Please try again." },
      { status: 400 },
    );
  }

  const email = user.email.trim().toLowerCase();

  try {
    const result = await getWishlistCollection().deleteOne({
      userEmail: email,
      studioId,
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { message: "This studio is not in your wishlist." },
        { status: 404 },
      );
    }

    return Response.json({ saved: false });
  } catch (error) {
    console.error("Failed to remove wishlist entry:", error);
    return Response.json(
      { message: "The studio could not be removed. Please try again." },
      { status: 500 },
    );
  }
}
