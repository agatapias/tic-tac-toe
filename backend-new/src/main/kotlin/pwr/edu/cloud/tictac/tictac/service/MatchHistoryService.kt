package pwr.edu.cloud.tictac.tictac.service

import lombok.extern.slf4j.Slf4j
import org.springframework.stereotype.Service
import pwr.edu.cloud.tictac.tictac.dto.MatchHistoryDto
import pwr.edu.cloud.tictac.tictac.entity.MatchHistory.Companion.toDto
import pwr.edu.cloud.tictac.tictac.repository.BoardRepository
import pwr.edu.cloud.tictac.tictac.repository.MatchHistoryRepository
import pwr.edu.cloud.tictac.tictac.repository.PlayerRepository

@Service
@Slf4j
class MatchHistoryService(
        private val matchHistoryRepository: MatchHistoryRepository,
        private val boardRepository: BoardRepository,
        private val playerRepository: PlayerRepository
) {
    fun getAllByUser(name: String): List<MatchHistoryDto> {
        val player = playerRepository.findByName(name)?.id ?: return emptyList()
        return matchHistoryRepository.findAllByUser(player).map {
            val matchId = it.matchEntity.id ?: return emptyList()
            val boardItems = boardRepository.findAllByMatchId(matchId)
            it.toDto(boardItems)
        }
    }
}