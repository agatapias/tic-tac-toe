package pwr.edu.cloud.tictac.tictac.entity

import jakarta.persistence.*
import pwr.edu.cloud.tictac.tictac.dto.MatchHistoryDto
import pwr.edu.cloud.tictac.tictac.dto.PlayerDto.Companion.toDto
import pwr.edu.cloud.tictac.tictac.entity.MatchHistory.Companion.toDto
import pwr.edu.cloud.tictac.tictac.entity.Match.Companion.toDto

@Entity
@Table(name = "history")
data class MatchHistory(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Int? = null,
        @OneToOne
        var match: Match,
        @OneToOne
        @JoinColumn(name = "player_won_id")
        var playerWon: Player,
        @OneToOne
        @JoinColumn(name = "player_lost_id")
        var playerLost: Player,
        var timestamp: Long
) {
        companion object {
                fun MatchHistory.toDto(boardItems: List<BoardItem>) = MatchHistoryDto(
                        id = id,
                        match = match.toDto(boardItems),
                        playerWon = playerWon.toDto(),
                        playerLost = playerLost.toDto(),
                        timestamp = timestamp
                )
        }
}
