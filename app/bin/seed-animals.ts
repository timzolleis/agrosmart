import { fromPromise, ResultAsync } from 'neverthrow';
import { faker } from '@faker-js/faker';
import { prisma } from '~/lib/db.server';
import { wrapPrismaError } from '~/lib/error/prisma-error';
import { listFarms } from '~/modules/farm/repository/farm-repository.server';

function seedHerd({ farmId }: { farmId: string }) {
  //Creates a herd with a random name
  return fromPromise(prisma.herd.create({
    data: {
      name: 'Herd ' + faker.string.alphanumeric(5),
      farmId,
    },
  }), wrapPrismaError());
}


function seedAnimals({ farmId, herdId }: { farmId: string, herdId: string }) {
  //Creates 100 cows with random names
  const array = Array.from({ length: 100 }, (_, i) => ({
    name: faker.animal.petName(),
    type: 'COW',
  }));
  return ResultAsync.combine(array.map(cow => fromPromise(prisma.animal.create({
    data: {
      name: cow.name,
      type: cow.type,
      farmId,
      birthDate: faker.date.past({ years: 2 }),
      herds: {
        connect: {
          id: herdId,
        },
      },
    },
  }), wrapPrismaError())));
}


export async function seedFarms() {
  return listFarms().andThen(farms => ResultAsync.combine(farms.map(farm => seedHerd({ farmId: farm.id }).andThen(herd => seedAnimals({
    herdId: herd.id,
    farmId: farm.id,
  })))));
}

seedFarms().then(() => {
  console.log("Farms seeded successfully");
})