import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { get, put } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"
import type {
  AnalyticsData,
  ChatSession,
  Contact,
  EditRecord,
  EmailRecord,
} from "./types"

const DATA_DIR = path.join(process.cwd(), "json-data")
const BLOB_PREFIX = "admin-data"

const FILES = {
  contacts: "contacts.json",
  emails: "emails.json",
  chat: "chat-sessions.json",
  analytics: "analytics.json",
} as const

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

function blobPath(filename: string): string {
  return `${BLOB_PREFIX}/${filename}`
}

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true })
}

async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  try {
    const raw = await readFile(filePath, "utf-8")
    return JSON.parse(raw) as T
  } catch {
    await writeJsonFile(filename, fallback)
    return fallback
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

async function readJsonBlob<T>(filename: string, fallback: T): Promise<T> {
  try {
    const result = await get(blobPath(filename), { access: "private" })
    if (!result || result.statusCode !== 200 || !result.stream) return fallback
    const text = await new Response(result.stream).text()
    return JSON.parse(text) as T
  } catch {
    return fallback
  }
}

async function writeJsonBlob<T>(filename: string, data: T): Promise<void> {
  await put(blobPath(filename), JSON.stringify(data, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  })
}

async function readJson<T>(filename: string, fallback: T): Promise<T> {
  if (useBlobStorage()) return readJsonBlob(filename, fallback)
  return readJsonFile(filename, fallback)
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  if (useBlobStorage()) return writeJsonBlob(filename, data)
  return writeJsonFile(filename, data)
}

export function createEditRecord(
  action: EditRecord["action"],
  changes: EditRecord["changes"],
  note?: string
): EditRecord {
  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    action,
    changes,
    note,
  }
}

export function diffChanges<T extends Record<string, unknown>>(
  before: Partial<T>,
  after: Partial<T>,
  keys: (keyof T)[]
): EditRecord["changes"] {
  const changes: EditRecord["changes"] = {}
  for (const key of keys) {
    const from = before[key]
    const to = after[key]
    if (JSON.stringify(from) !== JSON.stringify(to)) {
      changes[String(key)] = { from, to }
    }
  }
  return changes
}

export async function getContacts(): Promise<Contact[]> {
  return readJson<Contact[]>(FILES.contacts, [])
}

export async function saveContacts(contacts: Contact[]): Promise<void> {
  await writeJson(FILES.contacts, contacts)
}

export async function getContactById(id: string): Promise<Contact | undefined> {
  const contacts = await getContacts()
  return contacts.find((c) => c.id === id)
}

export async function getEmails(): Promise<EmailRecord[]> {
  return readJson<EmailRecord[]>(FILES.emails, [])
}

export async function saveEmails(emails: EmailRecord[]): Promise<void> {
  await writeJson(FILES.emails, emails)
}

export async function getEmailById(id: string): Promise<EmailRecord | undefined> {
  const emails = await getEmails()
  return emails.find((e) => e.id === id)
}

export async function getChatSessions(): Promise<ChatSession[]> {
  return readJson<ChatSession[]>(FILES.chat, [])
}

export async function saveChatSessions(sessions: ChatSession[]): Promise<void> {
  await writeJson(FILES.chat, sessions)
}

export async function getAnalytics(): Promise<AnalyticsData> {
  return readJson<AnalyticsData>(FILES.analytics, {
    pageViews: [],
    heatmapEvents: [],
  })
}

export async function saveAnalytics(data: AnalyticsData): Promise<void> {
  await writeJson(FILES.analytics, data)
}

export async function appendPageView(view: AnalyticsData["pageViews"][0]): Promise<void> {
  const data = await getAnalytics()
  data.pageViews.push(view)
  if (data.pageViews.length > 10000) {
    data.pageViews = data.pageViews.slice(-10000)
  }
  await saveAnalytics(data)
}

export async function appendHeatmapEvents(
  events: AnalyticsData["heatmapEvents"]
): Promise<void> {
  const data = await getAnalytics()
  data.heatmapEvents.push(...events)
  if (data.heatmapEvents.length > 50000) {
    data.heatmapEvents = data.heatmapEvents.slice(-50000)
  }
  await saveAnalytics(data)
}

export { uuidv4 }
