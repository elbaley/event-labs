type ErrorResponse = {
  message?: string;
};

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    let errorMessage = "Request failed";

    try {
      const data = (await response.json()) as ErrorResponse;
      errorMessage = data.message || errorMessage;
    } catch {
      // Keep the default error message when the response body is not JSON.
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
