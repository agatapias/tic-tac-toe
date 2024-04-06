package pwr.edu.cloud.tictac.tictac.service

import pwr.edu.cloud.tictac.tictac.error.exception.BoardItemNotFoundException
import pwr.edu.cloud.tictac.tictac.error.exception.MatchNotFoundException
import pwr.edu.cloud.tictac.tictac.repository.BoardRepository
import pwr.edu.cloud.tictac.tictac.repository.MatchRepository
import lombok.extern.slf4j.Slf4j
import org.springframework.stereotype.Service
import kotlin.jvm.optionals.getOrNull

@Service
@Slf4j
class MatchService(
        private val matchRepository: MatchRepository,
        private val boardRepository: BoardRepository
) {
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
        } else {
            match.isPlayer1Turn = !match.isPlayer1Turn
            matchRepository.save(match)
        }

        // Notify user?
    }
}