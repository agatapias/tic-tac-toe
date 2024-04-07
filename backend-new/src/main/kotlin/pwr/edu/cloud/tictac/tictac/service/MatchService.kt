package pwr.edu.cloud.tictac.tictac.service

import pwr.edu.cloud.tictac.tictac.error.exception.BoardItemNotFoundException
import pwr.edu.cloud.tictac.tictac.error.exception.MatchNotFoundException
import pwr.edu.cloud.tictac.tictac.repository.BoardRepository
import pwr.edu.cloud.tictac.tictac.repository.MatchRepository
import lombok.extern.slf4j.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
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
        val match = matchRepository.findById(matchId).getOrNull() ?: throw MatchNotFoundException()

        // Set appropriate board number (+check if possible)
        val board = boardRepository.findAllByMatchIdAndPosition(matchId, position).firstOrNull()
                ?: throw BoardItemNotFoundException()

        board.sign = match.isPlayer1Turn
        boardRepository.save(board)

        // check if game over
        val boardItems = boardRepository.findAllByMatchId(matchId)
        val isGameOver = boardItems.all { it.sign != null }

        if (isGameOver) {
            // Check who won

            // End the game
            simpMessagingTemplate?.convertAndSend("/topic/matchWon/${match.player1.id}", true)
            simpMessagingTemplate?.convertAndSend("/topic/matchWon/${match.player2.id}", true)
        } else {
            match.isPlayer1Turn = !match.isPlayer1Turn
            matchRepository.save(match)
        }

        // Notify user?
        simpMessagingTemplate?.convertAndSend("/topic/matchChange/${match.player1.id}", match)
        simpMessagingTemplate?.convertAndSend("/topic/matchChange/${match.player2.id}", match)
    }
}