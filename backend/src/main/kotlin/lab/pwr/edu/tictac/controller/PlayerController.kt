package lab.pwr.edu.tictac.controller

import lab.pwr.edu.tictac.service.PlayerService
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping

@Controller
class PlayerController(
        private val playerService: PlayerService
) {

    @PostMapping("/player/{name}")
    fun registerPlayer(
            @PathVariable name: String
    ): ResponseEntity<Unit> {
        return ResponseEntity.ok(playerService.onPlayerJoin(name))
    }
}