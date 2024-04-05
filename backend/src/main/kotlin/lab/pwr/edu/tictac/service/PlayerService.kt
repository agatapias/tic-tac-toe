package lab.pwr.edu.tictac.service

import lab.pwr.edu.tictac.entity.BoardItem
import lab.pwr.edu.tictac.entity.Match
import lab.pwr.edu.tictac.entity.Player
import lab.pwr.edu.tictac.repository.BoardRepository
import lab.pwr.edu.tictac.repository.PlayerRepository
import lombok.extern.slf4j.Slf4j
import org.springframework.stereotype.Service

@Service
@Slf4j
class PlayerService(
        private val playerRepository: PlayerRepository,
        private val boardRepository: BoardRepository
) {
    fun onPlayerJoin(name: String) {
        // create player object
        val player = Player(
                name = name,
                timestamp = System.currentTimeMillis()
        )

        val players: List<Player> = playerRepository.findAll()
        if (players.isEmpty()) {
            // add player to queue
            playerRepository.save(player)
            // TODO: wait?
            return
        }

        // find another player
        val player2 = players.firstOrNull()
        if (player2 == null) {
            // TODO: handle error
            return
        }

        // Create a new match
        val match = Match(
                player1 = player,
                player2 = player2
        )

        // Create new 9 BoardItems and assign to Match
        createBoard(match)

        // Notify user?
    }

    private fun createBoard(match: Match) {
        for (i in 1..9) {
            val board = BoardItem(
                    position = i,
                    match = match
            )
            boardRepository.save(board)
        }
    }
}