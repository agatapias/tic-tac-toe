package pwr.edu.cloud.tictac.tictac.service

import pwr.edu.cloud.tictac.tictac.error.exception.BoardItemNotFoundException
import pwr.edu.cloud.tictac.tictac.error.exception.MatchNotFoundException
import pwr.edu.cloud.tictac.tictac.repository.BoardRepository
import pwr.edu.cloud.tictac.tictac.repository.MatchRepository
import lombok.extern.slf4j.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import pwr.edu.cloud.tictac.tictac.dto.BoardDto.Companion.toBoardDto
import pwr.edu.cloud.tictac.tictac.dto.MatchDto
import pwr.edu.cloud.tictac.tictac.dto.PlayerDto.Companion.toDto
import pwr.edu.cloud.tictac.tictac.entity.MatchHistory
import pwr.edu.cloud.tictac.tictac.entity.Player
import pwr.edu.cloud.tictac.tictac.error.exception.FieldAlreadySelectedException
import pwr.edu.cloud.tictac.tictac.repository.MatchHistoryRepository
import pwr.edu.cloud.tictac.tictac.repository.PlayerRepository
import kotlin.jvm.optionals.getOrNull

private val WIN_LINES = listOf(
        listOf(0, 1, 2),
        listOf(3, 4, 5),
        listOf(6, 7, 8),
        listOf(0, 3, 6),
        listOf(1, 4, 7),
        listOf(2, 5, 8),
        listOf(0, 4, 8),
        listOf(2, 4, 6),
)

@Service
@Slf4j
class MatchService(
        private val matchRepository: MatchRepository,
        private val boardRepository: BoardRepository,
        private val playerRepository: PlayerRepository,
        private val matchHistoryRepository: MatchHistoryRepository
) {
    @Autowired
    private val simpMessagingTemplate: SimpMessagingTemplate? = null
    fun makeMove(matchId: Int, position: Int) {
        // Get match for current players
        var match = matchRepository.findById(matchId).getOrNull() ?: throw MatchNotFoundException()

        var boardItems = boardRepository.findAllByMatchEntityId(matchId)
        if (boardItems.getOrNull(position - 1)?.sign != null) throw FieldAlreadySelectedException()

        // Set appropriate board number (+check if possible)
        val board = boardRepository.findAllByMatchEntityIdAndPosition(matchId, position).firstOrNull()
                ?: throw BoardItemNotFoundException()

        board.sign = match.isPlayer1Turn
        boardRepository.save(board)

        boardItems = boardRepository.findAllByMatchEntityId(matchId)

        // Update match data
        match.isPlayer1Turn = !match.isPlayer1Turn
        match = matchRepository.save(match)

        val dto = MatchDto(
                id = match.id,
                player1 = match.player1.toDto(),
                player2 = match.player2.toDto(),
                isPlayer1Turn = match.isPlayer1Turn,
                board = boardItems.map { it.toBoardDto() }
        )

        // Notify user
        simpMessagingTemplate?.convertAndSend("/topic/matchChange/${match.player1.name}", dto)
        simpMessagingTemplate?.convertAndSend("/topic/matchChange/${match.player2.name}", dto)

        // Check who won
        for (line in WIN_LINES) {
            val (a, b, c) = line
            if (boardItems[a].sign != null && boardItems[a].sign == boardItems[b].sign && boardItems[a].sign == boardItems[c].sign) {
                val playerWon: Player
                val playerLost: Player
                if (boardItems[a].sign == true) {
                    // Player 1 won
                    simpMessagingTemplate?.convertAndSend("/topic/matchWon/${match.player1.name}", true)
                    simpMessagingTemplate?.convertAndSend("/topic/matchWon/${match.player2.name}", false)
                    playerWon = match.player1
                    playerLost = match.player2
                } else {
                    // Player 2 won
                    simpMessagingTemplate?.convertAndSend("/topic/matchWon/${match.player1.name}", false)
                    simpMessagingTemplate?.convertAndSend("/topic/matchWon/${match.player2.name}", true)
                    playerWon = match.player2
                    playerLost = match.player1
                }

                val newMatchHistory = MatchHistory(
                        matchEntity = match,
                        playerWon = playerWon,
                        playerLost = playerLost,
                        timestamp = System.currentTimeMillis()
                )
                matchHistoryRepository.save(newMatchHistory)

                // Delete game
//                boardRepository.deleteAllById(boardItems.map { it.id })
//                match.id?.let { matchRepository.deleteById(it) }
//                match.player1.id?.let { playerRepository.deleteById(it) }
//                match.player2.id?.let { playerRepository.deleteById(it) }

                break
            }
        }
    }
}