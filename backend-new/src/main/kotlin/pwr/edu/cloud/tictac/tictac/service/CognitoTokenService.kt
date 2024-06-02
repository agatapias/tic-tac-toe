package pwr.edu.cloud.tictac.tictac.service

import com.auth0.jwk.JwkProviderBuilder
import com.auth0.jwt.JWT
import com.auth0.jwt.interfaces.DecodedJWT
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.net.URL
import java.security.interfaces.RSAPublicKey
import java.util.concurrent.TimeUnit

@Service
class CognitoTokenService {

    @Value("\${aws.cognito.userPoolId}")
    lateinit var userPoolId: String

    @Value("\${aws.region}")
    lateinit var region: String

    private val issuer by lazy {
        "https://cognito-idp.$region.amazonaws.com/$userPoolId"
    }

    private val jwkProvider by lazy {
        JwkProviderBuilder(URL("$issuer/.well-known/jwks.json"))
                .cached(10, 24, TimeUnit.HOURS) // cache up to 10 JWKs for 24 hours
                .build()
    }

    fun verifyToken(token: String): DecodedJWT {
        val jwt = JWT.decode(token)
        val jwk = jwkProvider.get(jwt.keyId)

        val algorithm = com.auth0.jwt.algorithms.Algorithm.RSA256(jwk.publicKey as RSAPublicKey, null)
        val verifier = JWT.require(algorithm)
                .withIssuer(issuer)
                .build()

        return verifier.verify(token)
    }
}