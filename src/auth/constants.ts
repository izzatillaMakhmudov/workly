export class JwtConstants {
    static readonly secret = 'secretKey'; // This should be stored securely, e.g., in environment variables
    static readonly expiresIn = '5h'; // Token expiration time
    static readonly refreshTokenExpiresIn = '7d'; // Refresh token expiration time
    static readonly algorithm = 'HS256'; // JWT signing algorithm
    static readonly issuer = 'your-issuer'; // Issuer of the token
    static readonly audience = 'your-audience'; // Audience for which the token is intended
    static readonly subject = 'auth'; // Subject of the token
    static readonly header = {
        typ: 'JWT', // Type of the token
        alg: 'HS256' // Algorithm used for signing the token
    };
    static readonly refreshTokenHeader = {
        typ: 'JWT', // Type of the refresh token
        alg: 'HS256' // Algorithm used for signing the refresh token
    };
    static readonly tokenPrefix = 'Bearer '; // Prefix for the token in the Authorization header
    static readonly refreshTokenPrefix = 'Refresh '; // Prefix for the refresh token in the Authorization header
    static readonly tokenType = 'JWT'; // Type of the token
    static readonly refreshTokenType = 'Refresh'; // Type of the refresh token
    static readonly tokenClaim = 'sub'; // Claim for the subject in the token
    static readonly refreshTokenClaim = 'refresh_sub'; // Claim for the subject in the refresh token
    static readonly tokenIssuer = 'https://your-issuer.com'; // Issuer URL for the token
    static readonly refreshTokenIssuer = 'https://your-refresh-issuer.com'; // Issuer URL for the refresh token
    static readonly tokenAudience = 'https://your-audience.com'; // Audience URL for the token
    static readonly refreshTokenAudience = 'https://your-refresh-audience.com'; // Audience URL for the refresh token
    static readonly tokenSubject = 'user'; // Subject for the token
    static readonly refreshTokenSubject = 'user_refresh'; // Subject for the refresh token
    static readonly tokenExpiration = 3600; // Token expiration time in seconds
}