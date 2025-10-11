import * as bcrypt from 'bcryptjs';
import { PrismaClient } from './client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const hashedPassword = await bcrypt.hash('test', 10);
  console.log('Generated password hash.');

  // Clean up existing data to ensure a fresh start
  await prisma.roleAssign.deleteMany();
  await prisma.message.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.category.deleteMany();
  await prisma.role.deleteMany();
  await prisma.server.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleaned up old data.');

  // Create Users
  const alice = await prisma.user.create({
    data: {
      username: 'Alice',
      nickname: 'Alice',
      passwordHash: hashedPassword,
      isOwner: true,
    },
  });
  const bob = await prisma.user.create({
    data: {
      username: 'Bob',
      nickname: 'Bobby',
      passwordHash: hashedPassword,
      isAdmin: true,
    },
  });
  const charlie = await prisma.user.create({
    data: {
      username: 'Charlie',
      passwordHash: hashedPassword,
    },
  });
  console.log(`Created users: ${alice.username}, ${bob.username}, ${charlie.username}`);

  // Create a Server
  const server = await prisma.server.create({
    data: {
      name: 'TS Lovers',
      description: 'Static Types Win',
    },
  });
  console.log(`Created server: ${server.name}`);

  // Create Roles for the server
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      serverId: server.id,
      canCreateChannels: true,
      canKickUsers: true,
      canModifyRoles: true,
      canTimeout: true,
    },
  });
  const memberRole = await prisma.role.create({
    data: { name: 'Member', serverId: server.id },
  });
  console.log(`Created roles: ${adminRole.name}, ${memberRole.name}`);

  // Assign roles to users
  await prisma.roleAssign.createMany({
    data: [
      { userId: alice.id, roleId: adminRole.id },
      { userId: bob.id, roleId: adminRole.id },
      { userId: charlie.id, roleId: memberRole.id },
    ],
  });
  console.log('Assigned roles to users.');

  // Create Categories
  const generalCategory = await prisma.category.create({
    data: {
      name: 'General',
      serverId: server.id,
    },
  });
  const devCategory = await prisma.category.create({
    data: {
      name: 'Development',
      serverId: server.id,
    },
  });

  // Set the category order (linked-list) and head category for the server
  await prisma.server.update({
    where: { id: server.id },
    data: { headCategoryId: generalCategory.id },
  });
  await prisma.category.update({
    where: { id: generalCategory.id },
    data: { nextCategoryId: devCategory.id },
  });
  console.log(`Created categories: ${generalCategory.name}, ${devCategory.name}`);

  // Create Channels
  const welcomeChannel = await prisma.channel.create({
    data: {
      name: 'welcome',
      serverId: server.id,
    },
  });
  const announcementsChannel = await prisma.channel.create({
    data: {
      name: 'announcements',
      serverId: server.id,
    },
  });

  // Set channel order for the "General" category
  await prisma.category.update({
    where: { id: generalCategory.id },
    data: { headChannelId: welcomeChannel.id },
  });
  await prisma.channel.update({
    where: { id: welcomeChannel.id },
    data: { nextChannelId: announcementsChannel.id },
  });
  console.log(`Created channels: ${welcomeChannel.name}, ${announcementsChannel.name}`);

  // Create a Message
  const firstMessage = await prisma.message.create({
    data: {
      text: `Welcome to the ${server.name} server, ${bob.username}!`,
      channelId: welcomeChannel.id,
      userId: alice.id,
    },
  });
  console.log(`Created a welcome message.`);

  // Create a Reply
  await prisma.message.create({
    data: {
      text: 'Glad to be here!',
      channelId: welcomeChannel.id,
      userId: bob.id,
      repliesToId: firstMessage.id,
    },
  });
  console.log(`Created a reply.`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
