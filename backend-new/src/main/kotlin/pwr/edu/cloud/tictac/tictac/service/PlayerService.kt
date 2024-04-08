package pwr.edu.cloud.tictac.tictac.service

import lombok.extern.slf4j.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import pwr.edu.cloud.tictac.tictac.dto.BoardDto.Companion.toBoardDto
import pwr.edu.cloud.tictac.tictac.dto.MatchDto
import pwr.edu.cloud.tictac.tictac.entity.BoardItem
import pwr.edu.cloud.tictac.tictac.entity.Match
import pwr.edu.cloud.tictac.tictac.entity.Player
import pwr.edu.cloud.tictac.tictac.error.exception.NameAlreadyExistsException
import pwr.edu.cloud.tictac.tictac.error.exception.NameBlankException
import pwr.edu.cloud.tictac.tictac.repository.BoardRepository
import pwr.edu.cloud.tictac.tictac.repository.MatchRepository
import pwr.edu.cloud.tictac.tictac.repository.PlayerRepository


@Service
@Slf4j
class PlayerService(
        private val playerRepository: PlayerRepository,
        private val boardRepository: BoardRepository,
        private val matchRepository: MatchRepository,
) {
    @Autowired
    private val simpMessagingTemplate: SimpMessagingTemplate? = null

    fun onPlayerJoin(name: String) {
        if (name.isBlank()) throw NameBlankException()
        val players: List<Player> = playerRepository.findAll()
        if (players.any { it.name == name }) throw NameAlreadyExistsException()

        // create player object
        val player = Player(
                name = name,
                timestamp = System.currentTimeMillis()
        )

        simpMessagingTemplate?.convertAndSend("/topic/matchStartedTest/${player.name}", true)

        // add player to queue
        val savedPlayer = playerRepository.save(player)

        if (players.isEmpty()) return

        // find another player
        val player2 = players.firstOrNull()
        if (player2 != null) {
            // Create a new match
            val match = Match(
                    player1 = savedPlayer,
                    player2 = player2
            )
            val savedMatch = matchRepository.save(match)

            // Create new 9 BoardItems and assign to Match
            val board = createBoard(savedMatch)

            val dto = MatchDto(
                    id = savedMatch.id,
                    isPlayer1Turn = savedMatch.isPlayer1Turn,
                    player1 = savedPlayer.name,
                    player2 = player2.name,
                    board = board.map { it.toBoardDto() }
            )

            // Notify user
            simpMessagingTemplate?.convertAndSend("/topic/matchStarted/${savedPlayer.name}", dto)
            simpMessagingTemplate?.convertAndSend("/topic/matchStarted/${player2.name}", dto)
        }
    }

    private fun createBoard(match: Match): List<BoardItem> {
        val list = mutableListOf<BoardItem>()
        for (i in 1..9) {
            val board = BoardItem(
                    position = i,
                    match = match
            )
            list.add(board)
            boardRepository.save(board)
        }
        return list
    }
}