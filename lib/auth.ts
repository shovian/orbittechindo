// import { useAuthStore } from '@/store/authStore';

// export const apiRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
//   const { accessToken, refreshToken, setAccessToken } = useAuthStore.getState();

//   let res = await fetch(url, {
//     ...options,
//     headers: {
//       ...options.headers,
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   if (res.status === 401) {
//     // Try refreshing the token
//     const refreshed = await refreshToken();
//     if (refreshed) {
//       res = await fetch(url, {
//         ...options,
//         headers: {
//           ...options.headers,
//           Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
//         },
//       });
//     }
//   }

//   return res;
// };
