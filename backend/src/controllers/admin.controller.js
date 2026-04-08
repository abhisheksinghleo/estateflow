const prisma = require('../config/prisma');
const { PropertyApprovalStatus } = require('@prisma/client');

async function listPendingProperties(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const skip = (page - 1) * limit;

    const where = { approvalStatus: PropertyApprovalStatus.PENDING };

    const total = await prisma.property.count({ where });

    const properties = await prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'asc' },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        agent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        images: true
      }
    });

    return res.status(200).json({
      data: properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function updatePropertyStatus(req, res, next) {
  try {
    const propertyId = req.params.id;
    const action = req.body.action;
    const rejectionReason = req.body.rejectionReason;

    const existing = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        approvalStatus: true
      }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (existing.approvalStatus !== PropertyApprovalStatus.PENDING) {
      return res.status(400).json({
        message: 'Only pending listings can be approved or rejected'
      });
    }

    const isApprove = action === 'APPROVE';

    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: {
        approvalStatus: isApprove
          ? PropertyApprovalStatus.APPROVED
          : PropertyApprovalStatus.REJECTED,
        isPublished: isApprove,
        rejectionReason: isApprove ? null : rejectionReason,
        approvedById: req.user.id,
        approvedAt: new Date()
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return res.status(200).json({
      message: isApprove ? 'Property approved successfully' : 'Property rejected successfully',
      property: updated
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listPendingProperties,
  updatePropertyStatus
};
