export const routes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  mypage: "/mypage",
  nickname: "/nickname",
  createChoice: "/choices/new",
  statsHome: "/stats",
  authCallback: "/auth/callback",
  choice: (id: string) => `/choices/${id}`,
  stats: (gameId: string, options?: { voted?: boolean }) => {
    const params = new URLSearchParams();
    params.set("game", gameId);
    if (options?.voted) {
      params.set("voted", "1");
    }
    return `/stats?${params.toString()}`;
  },
  feed: (sort: "latest" | "popular" = "latest", page = 1) => {
    const params = new URLSearchParams();

    if (sort === "popular") {
      params.set("sort", "popular");
    } else if (page > 1) {
      params.set("page", String(page));
    }

    const query = params.toString();
    return query ? `/?${query}` : "/";
  },
} as const;

export const protectedRoutes = [
  routes.mypage,
  routes.createChoice,
  routes.nickname,
] as const;
