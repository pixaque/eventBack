const { PrismaClient } = require("@prisma/client");

let prisma = new PrismaClient({
  log: ['query'],
});

const initializePrisma = () => {
  prisma = prisma || new PrismaClient({
    log: ['query'],
  });
};

const closePrisma = async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
};

exports.db = prisma;

if (process.env.NODE_ENV !== "production") {
  initializePrisma();
}

// Optionally, you can close the Prisma client when the application exits
process.on('exit', closePrisma);
process.on('SIGINT', closePrisma);
process.on('SIGTERM', closePrisma);
