package pwr.edu.cloud.tictac.tictac.controller

import pwr.edu.cloud.tictac.tictac.service.PlayerService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import pwr.edu.cloud.tictac.tictac.config.CognitoPrincipal

@Controller
class PlayerController(
        private val playerService: PlayerService
) {

    @PostMapping("/player/{name}")
    fun registerPlayer(
            @PathVariable name: String
    ): ResponseEntity<Unit> {
        val yay = SecurityContextHolder.getContext().authentication.principal
        return ResponseEntity.ok(playerService.onPlayerJoin(name))
    }
}