package pwr.edu.cloud.tictac.tictac.controller

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import pwr.edu.cloud.tictac.tictac.dto.MatchHistoryDto
import pwr.edu.cloud.tictac.tictac.service.MatchHistoryService

@Controller
class MatchHistoryController(
        private val matchHistoryService: MatchHistoryService
) {
    @GetMapping("/match-history/{username}")
    fun getHistory(
            @PathVariable username: String
    ): ResponseEntity<List<MatchHistoryDto>> {
        return ResponseEntity.ok(matchHistoryService.getAllByUser(username))
    }
}