'use server'
import { cookies } from 'next/headers'
 
import * as client from '@/models/customPrismaClient/client'

if (!client.PrismaClient) {
  throw new Error('[setPrisma] error, prisma.PrismaClient not found please run prisma generate first')
}
const prisma = new client.PrismaClient()
console.log('prisma.$connect: ', prisma.$connect);
const connectResult = prisma.$connect();
connectResult.then(() => {
  console.log('connect success', Object.keys(prisma))
})

async function find(from: string, e: string, w) {
  console.log('find e: ', e);
  return prisma[e].findMany(w).then(r => r)
}
async function update(from: string, e: string, w) {
  console.log('update start: ', e, w);
  const r = prisma[e].update(w)
  await r
  console.log('update end: ', e);
  return r
}
async function remove(from: string, e: string, d) {
  return prisma[e].delete(d).then(r => r)
}
async function create(from: string, e: string, q) {
  console.log('create start: ', e, q);
  const r = prisma[e].create(q).then(r => r)
  await r
  console.log(`create end:`,e, q)
  return r
}
async function updateMany(from, e: string, query) {
  return prisma[e].updateMany(query).then(r => r)
}
async function upsert(from, e: string, query) {
  return prisma[e].upsert(query).then(r => r)
}
// should check relation here
async function executeDiff(from: string, e: string, d) {
  await Promise.all(d.create.map(async (obj) => {
    await prisma[e].create({
      data: obj.value
    })
  }))
  await Promise.all(d.update.map(async (obj) => {
    const { source } = obj
    if (source.id === undefined || source.id === null) {
      throw new Error('[update] must with a id')
    }
    await prisma[e].update({
      where: {
        id: source.id
      },
      data: obj.value
    })
  }))
  await Promise.all(d.remove.map(async obj => {
    const { source: string, value } = obj
    if (value.id === undefined || value.id === null) {
      throw new Error('[remove] must with a id')
    }
    await prisma[e].delete({
      where: {
        id: value.id
      }
    })
  }))
}

async function cookieSet(s, k, value) {
  if (typeof value === 'string'){
    cookies().set(k, value)
  }
}
async function cookieGet(s, k): Promise<any> {
  const v = cookies().get(k)
  return v
}
async function cookieClear(s, k) {
  return cookies().set(k, '')
}


export {
  find,
  update,
  remove,
  create,
  updateMany,
  upsert,
  executeDiff,
  cookieSet,
  cookieGet,
  cookieClear,
}
