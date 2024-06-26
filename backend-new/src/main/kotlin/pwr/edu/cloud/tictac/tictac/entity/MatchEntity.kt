package pwr.edu.cloud.tictac.tictac.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToOne
import pwr.edu.cloud.tictac.tictac.dto.BoardDto.Companion.toBoardDto
import pwr.edu.cloud.tictac.tictac.dto.MatchDto
import pwr.edu.cloud.tictac.tictac.dto.PlayerDto.Companion.toDto

@Entity
data class MatchEntity(
        @Id
        @GeneratedValue(strategy = GenerationType.SEQUENCE)
        var id: Int? = null,
        @OneToOne
        var player1: Player,
        @OneToOne
        var player2: Player,
        var isPlayer1Turn: Boolean = true,
) {
        companion object {
                fun MatchEntity.toDto(boardItems: List<BoardItem>) = MatchDto(
                        id = id,
                        player1 = player1.toDto(),
                        player2 = player2.toDto(),
                        isPlayer1Turn = isPlayer1Turn,
                        board = boardItems.map { it.toBoardDto() }
                )
        }
}
