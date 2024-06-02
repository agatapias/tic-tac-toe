package pwr.edu.cloud.tictac.tictac.config

import org.springframework.context.annotation.Configuration
import org.springframework.messaging.Message
import org.springframework.messaging.MessageChannel
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.messaging.simp.stomp.StompCommand
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.support.ChannelInterceptor
import org.springframework.messaging.support.MessageHeaderAccessor
import org.springframework.stereotype.Component
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer
import pwr.edu.cloud.tictac.tictac.service.CognitoTokenService

@Configuration
@EnableWebSocketMessageBroker
class WebSocketConfig(
        private val jwtChannelInterceptor: JWTChannelInterceptor
) : WebSocketMessageBrokerConfigurer {
    override fun configureMessageBroker(registy: MessageBrokerRegistry) {
        registy.enableSimpleBroker("/topic")
        registy.setApplicationDestinationPrefixes("/app")
    }

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        registry.addEndpoint("/stomp")
                .setAllowedOrigins("http://localhost:3000", "http://44.192.56.5:3000")
                .withSockJS()
    }

    override fun configureClientInboundChannel(registration: org.springframework.messaging.simp.config.ChannelRegistration) {
        registration.interceptors(jwtChannelInterceptor)
    }
}

@Component
class JWTChannelInterceptor(
        private val cognitoTokenService: CognitoTokenService
) : ChannelInterceptor {

    override fun preSend(message: Message<*>, channel: MessageChannel): Message<*>? {
        val accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor::class.java)

        if (StompCommand.CONNECT == accessor?.command) {
            val token = accessor.getFirstNativeHeader("Authorization")?.removePrefix("Bearer ")
            if (token != null) {
                try {
                    val jwt = cognitoTokenService.verifyToken(token)
                    accessor.user = CognitoPrincipal(jwt.subject, jwt.claims)
                } catch (e: Exception) {
                    throw RuntimeException("Invalid Token", e)
                }
            } else {
                throw RuntimeException("Missing Token")
            }
        }

        return message
    }
}