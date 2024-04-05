package lab.pwr.edu.tictac.controller

import lab.pwr.edu.tictac.service.MatchService
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping

@Controller
class MatchController(
        private val matchService: MatchService
) {
    @PostMapping("/match/{id}/{position}")
    fun makeMove(
            @PathVariable id: Int,
            @PathVariable position: Int
    ): ResponseEntity<Unit> {
        return ResponseEntity.ok(matchService.makeMove(matchId = id, position = position))
    }
}