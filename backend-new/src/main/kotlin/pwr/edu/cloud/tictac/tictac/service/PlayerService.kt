package pwr.edu.cloud.tictac.tictac.service

import lombok.extern.slf4j.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import pwr.edu.cloud.tictac.tictac.dto.BoardDto.Companion.toBoardDto
import pwr.edu.cloud.tictac.tictac.dto.MatchDto
import pwr.edu.cloud.tictac.tictac.dto.PlayerDto.Companion.toDto
import pwr.edu.cloud.tictac.tictac.entity.BoardItem
import pwr.edu.cloud.tictac.tictac.entity.MatchEntity
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

    fun onPlayerJoin(name: String, displayName: String) {
        println("onPlayerJoin called")
        if (name.isBlank()) throw NameBlankException()
        println("name: $name")
        var players: List<Player> = playerRepository.findAll()
        if (players.any { it.name == name }) throw NameAlreadyExistsException()
        println("name new")

        players = players.filter { !it.isInGame }
        println("players filtered")

        // create player object
        val player = Player(
                name = name,
                displayName = displayName,
                timestamp = System.currentTimeMillis()
        )

        simpMessagingTemplate?.convertAndSend("/topic/matchStartedTest/${player.name}", true)

        // add player to queue
        var savedPlayer = playerRepository.save(player)

        if (players.isEmpty()) return

        // find another player
        var player2 = players.firstOrNull()
        if (player2 != null) {
            // Create a new match
            val match = MatchEntity(
                    player1 = savedPlayer,
                    player2 = player2
            )
            val savedMatch = matchRepository.save(match)

            // Update players status
            savedPlayer.isInGame = true
            playerRepository.save(savedPlayer)
            player2.isInGame = true
            playerRepository.save(player2)

            // Create new 9 BoardItems and assign to Match
            val board = createBoard(savedMatch)

            val dto = MatchDto(
                    id = savedMatch.id,
                    isPlayer1Turn = savedMatch.isPlayer1Turn,
                    player1 = savedPlayer.toDto(),
                    player2 = player2.toDto(),
                    board = board.map { it.toBoardDto() }
            )

            Thread.sleep(2_000)
            // Notify user
            println(savedPlayer.name)
            simpMessagingTemplate?.convertAndSend("/topic/matchStarted/${savedPlayer.name}", dto)
            println(player2.name)
            simpMessagingTemplate?.convertAndSend("/topic/matchStarted/${player2.name}", dto)
        }
    }

    private fun createBoard(match: MatchEntity): List<BoardItem> {
        val list = mutableListOf<BoardItem>()
        for (i in 1..9) {
            val board = BoardItem(
                    position = i,
                    matchEntity = match
            )
            list.add(board)
            boardRepository.save(board)
        }
        return list
    }
}