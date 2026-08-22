import prisma from '../config/db.js';
import { ConflictError, NotFoundError } from '../utils/errors.js';

export async function getSavedDestinations(userId) {
  const saved = await prisma.savedDestination.findMany({
    where: { userId },
    include: { destination: true },
    orderBy: { createdAt: 'desc' },
  });
  return saved.map(s => s.destination);
}

export async function saveDestination(userId, destinationData) {
  // Find or create destination
  let destination;
  if (destinationData.placeId) {
    destination = await prisma.destination.findUnique({
      where: { placeId: destinationData.placeId },
    });
  }

  if (!destination) {
    destination = await prisma.destination.create({
      data: {
        name: destinationData.name,
        country: destinationData.country || null,
        placeId: destinationData.placeId || null,
        latitude: destinationData.latitude || null,
        longitude: destinationData.longitude || null,
        imageUrl: destinationData.imageUrl || null,
        description: destinationData.description || null,
      },
    });
  }

  // Check if already saved
  const existing = await prisma.savedDestination.findUnique({
    where: { userId_destinationId: { userId, destinationId: destination.id } },
  });

  if (existing) throw new ConflictError('Destination already saved');

  await prisma.savedDestination.create({
    data: { userId, destinationId: destination.id },
  });

  return destination;
}

export async function unsaveDestination(savedId, userId) {
  const saved = await prisma.savedDestination.findFirst({
    where: { id: savedId, userId },
  });
  if (!saved) throw new NotFoundError('Saved destination');

  await prisma.savedDestination.delete({ where: { id: savedId } });
  return { deleted: true };
}
