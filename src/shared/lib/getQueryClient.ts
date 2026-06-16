import { QueryClient, isServer, defaultShouldDehydrateQuery } from "@tanstack/react-query";

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: 1000 * 60 * 10,
        retry: 1,
      },
      dehydrate: {
        // streaming SSR: void prefetch로 시작된 pending 쿼리도 직렬화에 포함해야
        // 서버에서 resolve된 데이터가 같은 응답 스트림으로 전달된다.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
        shouldRedactErrors: () => false,
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
