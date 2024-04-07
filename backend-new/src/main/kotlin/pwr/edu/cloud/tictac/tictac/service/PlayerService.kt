package pwr.edu.cloud.tictac.tictac.service

import lombok.extern.slf4j.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import pwr.edu.cloud.tictac.tictac.entity.BoardItem
import pwr.edu.cloud.tictac.tictac.entity.Match
import pwr.edu.cloud.tictac.tictac.entity.Player
import pwr.edu.cloud.tictac.tictac.repository.BoardRepository
import pwr.edu.cloud.tictac.tictac.repository.PlayerRepository


@Service
@Slf4j
class PlayerService(
        private val playerRepository: PlayerRepository,
        private val boardRepository: BoardRepository
) {
    @Autowired
    private val simpMessagingTemplate: SimpMessagingTemplate? = null

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
        if (player2 != null) {
            // Create a new match
            val match = Match(
                    player1 = player,
                    player2 = player2
            )

            // Create new 9 BoardItems and assign to Match
            createBoard(match)

            // Notify user
            simpMessagingTemplate?.convertAndSend("/topic/matchStarted/${player.id}", match)
            simpMessagingTemplate?.convertAndSend("/topic/matchStarted/${player2.id}", match)
        }
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