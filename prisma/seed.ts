import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedAdminData } from "../src/lib/adminTypes";
import { galleryItems } from "../src/lib/galleryContent";
import { images } from "../src/lib/images";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.adminUser.findFirst();
  if (!existingAdmin) {
    const password = process.env.ADMIN_INITIAL_PASSWORD?.trim() || "pali";
    await prisma.adminUser.create({
      data: { passwordHash: await bcrypt.hash(password, 12) },
    });
    console.log("Created admin user (initial password from ADMIN_INITIAL_PASSWORD)");
  }

  const data = seedAdminData();

  for (const collection of data.collections) {
    await prisma.category.upsert({
      where: { id: collection.id },
      create: { id: collection.id, label: collection.name.en },
      update: { label: collection.name.en },
    });

    await prisma.collectionCover.upsert({
      where: { id: collection.id },
      create: {
        id: collection.id,
        label: collection.name.en,
        imageUrl: collection.coverImageUrl ?? images.accentBowl,
        sortOrder: 0,
      },
      update: {
        label: collection.name.en,
        imageUrl: collection.coverImageUrl ?? images.accentBowl,
      },
    });
  }

  for (const [index, product] of data.products.entries()) {
    const gallery = galleryItems.find((item) => item.id === product.id);
    const imageUrl = gallery?.image ?? `/images/gallery/${product.imageLabel}`;

    await prisma.product.upsert({
      where: { sku: product.sku },
      create: {
        id: product.id,
        sku: product.sku,
        title: product.title,
        pricePln: product.pricePln,
        stock: product.stock,
        categoryId: product.categoryId,
        status: product.status,
        description: product.description,
        specs: product.specs,
        sortOrder: index,
        images: {
          create: {
            url: imageUrl,
            alt: product.title,
            sortOrder: 0,
            isPrimary: true,
          },
        },
      },
      update: {
        title: product.title,
        pricePln: product.pricePln,
        stock: product.stock,
        categoryId: product.categoryId,
        status: product.status,
        description: product.description,
        specs: product.specs,
        sortOrder: index,
      },
    });
  }

  for (const [index, type] of data.workshopTypes.entries()) {
    await prisma.workshopType.upsert({
      where: { id: type.id },
      create: {
        id: type.id,
        label: type.label,
        description: type.description,
        pricePln: type.pricePln,
        duration: type.duration,
        enabled: type.enabled,
        sortOrder: index,
      },
      update: {
        label: type.label,
        description: type.description,
        pricePln: type.pricePln,
        duration: type.duration,
        enabled: type.enabled,
        sortOrder: index,
      },
    });
  }

  for (const [index, slot] of data.workshops.entries()) {
    const workshopTypeId = data.workshopTypes[0]?.id ?? "one-time";
    await prisma.workshopSlot.upsert({
      where: { id: slot.id },
      create: {
        id: slot.id,
        workshopTypeId,
        day: slot.day,
        date: slot.date,
        time: slot.time,
        available: slot.available,
        spots: slot.spots,
        sortOrder: index,
      },
      update: {
        day: slot.day,
        date: slot.date,
        time: slot.time,
        available: slot.available,
        spots: slot.spots,
        sortOrder: index,
      },
    });
  }

  await prisma.siteContent.upsert({
    where: { id: "main" },
    create: { id: "main", data: data.siteCopy },
    update: { data: data.siteCopy },
  });

  await prisma.siteContent.upsert({
    where: { id: "content" },
    create: {
      id: "content",
      data: {
        faq: data.faq,
        contacts: data.contacts,
        delivery: data.delivery,
      },
    },
    update: {
      data: {
        faq: data.faq,
        contacts: data.contacts,
        delivery: data.delivery,
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
