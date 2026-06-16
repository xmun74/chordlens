import { QueryClient, isServer } from "@tanstack/react-query";

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: 1000 * 60 * 10,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  // 서버: 매 요청 새 인스턴스(요청 간 캐시 오염 방지).
  if (isServer) return makeQueryClient();
  // 브라우저: 싱글턴 재사용.
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
