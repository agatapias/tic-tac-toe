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
import pwr.edu.cloud.tictac.tictac.error.exception.FieldAlreadySelectedException
import kotlin.jvm.optionals.getOrNull

@Service
@Slf4j
class MatchService(
        private val matchRepository: MatchRepository,
        private val boardRepository: BoardRepository
) {
    @Autowired
    private val simpMessagingTemplate: SimpMessagingTemplate? = null
    fun makeMove(matchId: Int, position: Int) {
        // Get match for current players
        var match = matchRepository.findById(matchId).getOrNull() ?: throw MatchNotFoundException()

        var boardItems = boardRepository.findAllByMatchId(matchId)
        if (boardItems.getOrNull(position - 1)?.sign != null) throw FieldAlreadySelectedException()

        // Set appropriate board number (+check if possible)
        val board = boardRepository.findAllByMatchIdAndPosition(matchId, position).firstOrNull()
                ?: throw BoardItemNotFoundException()

        board.sign = match.isPlayer1Turn
        boardRepository.save(board)

        // check if game over
        boardItems = boardRepository.findAllByMatchId(matchId)
        val isGameOver = boardItems.all { it.sign != null }

        if (isGameOver) {
            // Check who won

            // End the game
            simpMessagingTemplate?.convertAndSend("/topic/matchWon/${match.player1.name}", true)
            simpMessagingTemplate?.convertAndSend("/topic/matchWon/${match.player2.name}", true)
        } else {
            match.isPlayer1Turn = !match.isPlayer1Turn
            match = matchRepository.save(match)
        }

        val dto = MatchDto(
                id = match.id,
                player1 = match.player1.name,
                player2 = match.player2.name,
                isPlayer1Turn = match.isPlayer1Turn,
                board = boardItems.map { it.toBoardDto() }
        )

        // Notify user?
        simpMessagingTemplate?.convertAndSend("/topic/matchChange/${match.player1.name}", dto)
        simpMessagingTemplate?.convertAndSend("/topic/matchChange/${match.player2.name}", dto)
    }
}