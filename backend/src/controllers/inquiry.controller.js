const prisma = require("../config/prisma");
const { PropertyApprovalStatus } = require("@prisma/client");

async function createInquiry(req, res, next) {
  try {
    const { propertyId, message } = req.body;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        ownerId: true,
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

    if (property.ownerId === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot inquire about your own listing" });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId,
        userId: req.user.id,
        message,
      },
    });

    return res.status(201).json({
      message: "Inquiry created",
      inquiry,
    });
  } catch (error) {
    return next(error);
  }
}

async function myInquiries(req, res, next) {
  try {
    const inquiries = await prisma.inquiry.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            price: true,
          },
        },
      },
    });

    return res.status(200).json({ data: inquiries });
  } catch (error) {
    return next(error);
  }
}

async function listPropertyInquiries(req, res, next) {
  try {
    const { propertyId } = req.params;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, ownerId: true },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const isAdmin =
      req.user.role === "ADMIN_HEAD" || req.user.role === "ADMIN_CO_HEAD";

    if (!isAdmin && property.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const inquiries = await prisma.inquiry.findMany({
      where: { propertyId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json({ data: inquiries });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createInquiry,
  myInquiries,
  listPropertyInquiries,
};
