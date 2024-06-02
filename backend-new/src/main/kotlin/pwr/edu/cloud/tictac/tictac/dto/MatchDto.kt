package pwr.edu.cloud.tictac.tictac.dto

data class MatchDto(
        val id: Int?,
        val player1: PlayerDto,
        val player2: PlayerDto,
        val isPlayer1Turn: Boolean,
        val board: List<BoardDto>
)
