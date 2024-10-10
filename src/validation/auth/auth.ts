import { REFRESH_TOKEN_ } from "@/graphql/user";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/constants/storage";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export const refreshAccessToken = (client: ApolloClient<NormalizedCacheObject>) => {
  return new Promise((resolve, reject) => {
    const rToken = localStorage.getItem(REFRESH_TOKEN);
    if (!rToken) {
      return reject('No refresh token available');
    }
    // const [refreshToken] = useMutation(REFRESH_TOKEN_);
    client.mutate({
      mutation: REFRESH_TOKEN_,
      variables: { refreshToken: rToken },
    })
      .then(data => {
        if (data.errors) {
          return reject(data.errors[0].message);
        }
        const { accessToken, refreshToken: newRefreshToken } = data.data.refreshToken;
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, newRefreshToken);
        resolve(accessToken);
      })
      .catch(err => {
        reject(err);
      });
  });
};
  