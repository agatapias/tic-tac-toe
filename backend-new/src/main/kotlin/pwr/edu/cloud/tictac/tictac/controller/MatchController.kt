package pwr.edu.cloud.tictac.tictac.controller

import pwr.edu.cloud.tictac.tictac.service.MatchService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import pwr.edu.cloud.tictac.tictac.config.CognitoPrincipal

@Controller
class MatchController(
        private val matchService: MatchService
) {
    @PostMapping("/match/{id}/{position}")
    fun makeMove(
            @AuthenticationPrincipal principal: CognitoPrincipal,
            @PathVariable id: Int,
            @PathVariable position: Int
    ): ResponseEntity<Unit> {
        return ResponseEntity.ok(matchService.makeMove(matchId = id, position = position))
    }
}