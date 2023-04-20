// ** Auth Endpoints
import { API_URL } from "../../../configs/endpoint"

export default {
  loginEndpoint: `${API_URL}/login`,
  registerEndpoint: `${API_URL}/register`,
  refreshEndpoint: `${API_URL}/refresh-token`,
  logoutEndpoint: `${API_URL}/logout`,

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}
