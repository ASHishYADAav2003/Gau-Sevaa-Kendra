import XLSX from "xlsx";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";
import { getPagination } from "../utils/pagination.js";
import { buildPublicUploadUrl } from "../utils/file.js";

const buildAnimalWhere = (query, onlyPublic = false) => {
  const where = {};

  if (onlyPublic) {
    where.status = "ACTIVE";
  } else if (query.status) {
    where.status = query.status;
  }

  if (query.breed) {
    where.breed = { contains: query.breed, mode: "insensitive" };
  }

  if (query.healthStatus) {
    where.healthStatus = { contains: query.healthStatus, mode: "insensitive" };
  }

  return where;
};

export const createAnimal = async (payload) =>
  prisma.animal.create({
    data: {
      ...payload,
      rescueDate: payload.rescueDate ? new Date(payload.rescueDate) : null
    },
    include: {
      images: true,
      medicalRecords: true
    }
  });

export const updateAnimal = async (animalId, payload) => {
  const animal = await prisma.animal.findUnique({
    where: { id: animalId }
  });

  if (!animal) {
    throw new AppError("Animal not found", 404);
  }

  return prisma.animal.update({
    where: { id: animalId },
    data: {
      ...payload,
      rescueDate:
        "rescueDate" in payload
          ? payload.rescueDate
            ? new Date(payload.rescueDate)
            : null
          : undefined
    },
    include: {
      images: true,
      medicalRecords: true
    }
  });
};

export const listAdminAnimals = async (query) => {
  const pagination = getPagination(query);
  const where = buildAnimalWhere(query);

  const [items, total] = await Promise.all([
    prisma.animal.findMany({
      where,
      include: {
        images: true,
        medicalRecords: true
      },
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take
    }),
    prisma.animal.count({ where })
  ]);

  return {
    items,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    }
  };
};

export const listPublicAnimals = async (query) => {
  const pagination = getPagination(query);
  const where = buildAnimalWhere(query, true);

  const [items, total] = await Promise.all([
    prisma.animal.findMany({
      where,
      include: {
        images: true
      },
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take
    }),
    prisma.animal.count({ where })
  ]);

  return {
    items,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    }
  };
};

export const getAnimalById = async (animalId) => {
  const animal = await prisma.animal.findUnique({
    where: { id: animalId },
    include: {
      images: true,
      medicalRecords: true,
      campaigns: true
    }
  });

  if (!animal) {
    throw new AppError("Animal not found", 404);
  }

  return animal;
};

export const uploadAnimalImages = async (animalId, files) => {
  const animal = await prisma.animal.findUnique({
    where: { id: animalId },
    include: { images: true }
  });

  if (!animal) {
    throw new AppError("Animal not found", 404);
  }

  if (animal.images.length + files.length > 5) {
    throw new AppError("A maximum of 5 images is allowed per animal", 400);
  }

  const startSortOrder = animal.images.length;

  return prisma.$transaction(
    files.map((file, index) =>
      prisma.animalImage.create({
        data: {
          animalId,
          imageUrl: buildPublicUploadUrl(`uploads/animals/${file.filename}`),
          sortOrder: startSortOrder + index
        }
      })
    )
  );
};

export const createMedicalRecord = async (animalId, payload) => {
  const animal = await prisma.animal.findUnique({
    where: { id: animalId }
  });

  if (!animal) {
    throw new AppError("Animal not found", 404);
  }

  return prisma.animalMedicalRecord.create({
    data: {
      animalId,
      ...payload,
      recordDate: new Date(payload.recordDate)
    }
  });
};

export const exportAnimals = async (query) => {
  const items = await prisma.animal.findMany({
    where: buildAnimalWhere(query),
    include: {
      images: true
    },
    orderBy: { createdAt: "desc" }
  });

  const rows = items.map((item) => ({
    AnimalID: item.id,
    TagID: item.tagId,
    Name: item.name,
    Status: item.status,
    Breed: item.breed || "",
    Gender: item.gender || "",
    AgeMonths: item.ageMonths ?? "",
    HealthStatus: item.healthStatus || "",
    RescueDate: item.rescueDate?.toISOString() || "",
    ShedLocation: item.shedLocation || "",
    ImageCount: item.images.length
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Animals");

  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
};
