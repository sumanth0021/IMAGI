export type DbStatus = "ok" | "error" | "loading"

export const DEFAULT_DB_TIMEOUT_MS = 7000

const DEFAULT_MESSAGE = "Please wait a moment or try again. If the issue continues, contact support."

export class DatabaseRequestError extends Error {
  readonly kind: "timeout" | "network" | "query"

  constructor(kind: "timeout" | "network" | "query", message?: string) {
    super(message || DEFAULT_MESSAGE)
    this.name = "DatabaseRequestError"
    this.kind = kind
  }
}

const extractMessage = (error: unknown) => {
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message?: unknown }).message
    if (typeof msg === "string" && msg.trim()) return msg
  }
  return DEFAULT_MESSAGE
}

export const normalizeDatabaseError = (error: unknown): DatabaseRequestError => {
  if (error instanceof DatabaseRequestError) return error

  const message = extractMessage(error)
  if (/timeout|timed out/i.test(message)) {
    return new DatabaseRequestError("timeout", DEFAULT_MESSAGE)
  }

  if (/failed to fetch|network|fetch/i.test(message)) {
    return new DatabaseRequestError("network", DEFAULT_MESSAGE)
  }

  return new DatabaseRequestError("query", message)
}

export async function withDatabaseTimeout<T>(promiseLike: PromiseLike<T>, timeoutMs = DEFAULT_DB_TIMEOUT_MS): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new DatabaseRequestError("timeout", DEFAULT_MESSAGE))
    }, timeoutMs)
  })

  try {
    return (await Promise.race([Promise.resolve(promiseLike), timeoutPromise])) as T
  } catch (error: unknown) {
    throw normalizeDatabaseError(error)
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

type SupabaseResponseLike = {
  error?: { message?: string | null } | null
}

export async function runSupabaseQuery<T extends SupabaseResponseLike>(
  query: PromiseLike<T>,
  timeoutMs = DEFAULT_DB_TIMEOUT_MS
): Promise<T> {
  try {
    const response = await withDatabaseTimeout(query, timeoutMs)
    if (response?.error) {
      throw new DatabaseRequestError("query", response.error.message || DEFAULT_MESSAGE)
    }
    return response
  } catch (error: unknown) {
    throw normalizeDatabaseError(error)
  }
}
