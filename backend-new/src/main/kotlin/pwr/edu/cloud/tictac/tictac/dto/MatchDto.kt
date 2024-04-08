package pwr.edu.cloud.tictac.tictac.dto

data class MatchDto(
        val id: Int?,
        val player1: String,
        val player2: String,
        val isPlayer1Turn: Boolean,
        val board: List<BoardDto>
)
