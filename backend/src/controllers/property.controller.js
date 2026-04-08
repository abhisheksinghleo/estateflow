const { PropertyApprovalStatus } = require('@prisma/client');
const prisma = require('../config/prisma');

function toNumber(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
}

function buildPublicPropertyFilters(query) {
  const where = {
    approvalStatus: PropertyApprovalStatus.APPROVED,
    isPublished: true,
  };

  if (query.city) {
    where.city = { contains: String(query.city), mode: 'insensitive' };
  }

  if (query.type) {
    where.type = String(query.type);
  }

  if (query.purpose) {
    where.purpose = String(query.purpose);
  }

  const minPrice = toNumber(query.minPrice);
  const maxPrice = toNumber(query.maxPrice);

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  return where;
}

async function createProperty(req, res, next) {
  try {
    let agentId;

    if (req.user.role === 'AGENT') {
      const profile = await prisma.agentProfile.findUnique({
        where: { userId: req.user.id },
        select: { id: true },
      });
      if (profile) agentId = profile.id;
    }

    const property = await prisma.property.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        purpose: req.body.purpose,
        price: Number(req.body.price),
        bedrooms: toNumber(req.body.bedrooms),
        bathrooms: toNumber(req.body.bathrooms),
        area: toNumber(req.body.area),
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        zipCode: req.body.zipCode,
        ownerId: req.user.id,
        agentId,
        approvalStatus: PropertyApprovalStatus.PENDING,
        isPublished: false,
      },
    });

    return res.status(201).json({
      message: 'Property submitted for admin approval',
      property,
    });
  } catch (error) {
    return next(error);
  }
}

async function listProperties(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const skip = (page - 1) * limit;

    const where = buildPublicPropertyFilters(req.query);

    const [total, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
    ]);

    return res.status(200).json({
      data: properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getPropertyById(req, res, next) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
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
    });

    if (
      !property ||
      property.approvalStatus !== PropertyApprovalStatus.APPROVED ||
      !property.isPublished
    ) {
      return res.status(404).json({ message: 'Property not found' });
    }

    return res.status(200).json({ data: property });
  } catch (error) {
    return next(error);
  }
}

async function listMyProperties(req, res, next) {
  try {
    const properties = await prisma.property.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    });

    return res.status(200).json({ data: properties });
  } catch (error) {
    return next(error);
  }
}

async function updateProperty(req, res, next) {
  try {
    const existing = await prisma.property.findUnique({
      where: { id: req.params.id },
      select: { id: true, ownerId: true },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const isAdmin = req.user.role === 'ADMIN_HEAD' || req.user.role === 'ADMIN_CO_HEAD';

    if (!isAdmin && existing.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const data = {};
    const textFields = [
      'title',
      'description',
      'type',
      'purpose',
      'address',
      'city',
      'state',
      'country',
      'zipCode',
    ];

    for (const key of textFields) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }

    if (req.body.price !== undefined) data.price = Number(req.body.price);
    if (req.body.bedrooms !== undefined) data.bedrooms = toNumber(req.body.bedrooms);
    if (req.body.bathrooms !== undefined) data.bathrooms = toNumber(req.body.bathrooms);
    if (req.body.area !== undefined) data.area = toNumber(req.body.area);

    if (!isAdmin) {
      data.approvalStatus = PropertyApprovalStatus.PENDING;
      data.isPublished = false;
      data.rejectionReason = null;
      data.approvedById = null;
      data.approvedAt = null;
    }

    const property = await prisma.property.update({
      where: { id: req.params.id },
      data,
    });

    return res.status(200).json({
      message: isAdmin
        ? 'Property updated'
        : 'Property updated and moved back to pending review',
      property,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createProperty,
  listProperties,
  getPropertyById,
  listMyProperties,
  updateProperty,
};
