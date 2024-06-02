package pwr.edu.cloud.tictac.tictac.config

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import pwr.edu.cloud.tictac.tictac.service.CognitoTokenService
import java.security.Principal

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig(
        private val cognitoTokenService: CognitoTokenService
) {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http.invoke {
            authorizeRequests {
                authorize("/player/**", permitAll)
                authorize("/match/**", permitAll)
                authorize("/stomp/**", permitAll)
                authorize("/auth/**", permitAll)
                anyRequest
                authenticated
            }
            csrf { disable() }
            sessionManagement { SessionCreationPolicy.STATELESS }
            addFilterBefore(JWTAuthenticationFilter(cognitoTokenService), UsernamePasswordAuthenticationFilter::class.java)
            cors { }
            exceptionHandling { authenticationEntryPoint = HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED) }
        }
        return http.build()
    }

    @Bean
    fun corsConfigurer(): WebMvcConfigurer? {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000", "http://44.192.56.5:3000")
                        .allowedMethods("GET", "POST", "DELETE", "PUT")
                        .allowCredentials(true)
            }
        }
    }
}

class JWTAuthenticationFilter(
        private val cognitoTokenService: CognitoTokenService
) : AbstractPreAuthenticatedProcessingFilter() {

    override fun getPreAuthenticatedPrincipal(request: HttpServletRequest): Any? {
        val token = request.getHeader("Authorization")?.removePrefix("Bearer ")
        return if (token != null) {
            try {
                val jwt = cognitoTokenService.verifyToken(token)
                CognitoPrincipal(jwt.subject, jwt.claims)
            } catch (e: Exception) {
                null
            }
        } else {
            null
        }
    }

    override fun getPreAuthenticatedCredentials(request: HttpServletRequest): Any? = null

    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        val principal = getPreAuthenticatedPrincipal(request as HttpServletRequest)
        if (principal != null) {
            val authentication = org.springframework.security.authentication.UsernamePasswordAuthenticationToken(principal, null, emptyList())
            SecurityContextHolder.getContext().authentication = authentication
        }
        chain.doFilter(request, response)
    }
}

data class CognitoPrincipal(val userId: String, val claims: Map<String, com.auth0.jwt.interfaces.Claim>) : Principal {
    override fun getName(): String {
        return "idk"
    }
}