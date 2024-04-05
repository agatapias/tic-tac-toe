package lab.pwr.edu.tictac.service

import lab.pwr.edu.tictac.error.exception.BoardItemNotFoundException
import lab.pwr.edu.tictac.error.exception.MatchNotFoundException
import lab.pwr.edu.tictac.repository.BoardRepository
import lab.pwr.edu.tictac.repository.MatchRepository
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

        val newBoard = board.copy(value = match.isPlayer1Turn)
        boardRepository.save(newBoard)

        // check if game over
        val boardItems = boardRepository.findAllByMatchId(matchId)
        val isGameOver = boardItems.all { it.value != null }

        if (isGameOver) {
            // Check who won
            // End the game
        } else {
            val newMatch = match.copy(isPlayer1Turn = !match.isPlayer1Turn)
            matchRepository.save(newMatch)
        }

        // Notify user?
    }
}