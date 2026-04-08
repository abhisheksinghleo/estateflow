const prisma = require("../config/prisma");
const { PropertyApprovalStatus } = require("@prisma/client");

async function addFavorite(req, res, next) {
  try {
    const { propertyId } = req.params;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        approvalStatus: true,
        isPublished: true,
      },
    });

    if (
      !property ||
      property.approvalStatus !== PropertyApprovalStatus.APPROVED ||
      !property.isPublished
    ) {
      return res.status(404).json({ message: "Property not found" });
    }

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId,
        },
      },
      update: {},
      create: {
        userId: req.user.id,
        propertyId,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            price: true,
            isPublished: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Added to favorites",
      data: favorite,
    });
  } catch (error) {
    return next(error);
  }
}

async function removeFavorite(req, res, next) {
  try {
    const { propertyId } = req.params;

    const deleted = await prisma.favorite.deleteMany({
      where: {
        userId: req.user.id,
        propertyId,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    return res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    return next(error);
  }
}

async function myFavorites(req, res, next) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          include: {
            images: true,
            owner: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ data: favorites });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  myFavorites,
};
