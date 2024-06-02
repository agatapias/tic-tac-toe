package pwr.edu.cloud.tictac.tictac.dto

data class MatchHistoryDto(
        var id: Int?,
        var match: MatchDto,
        var playerWon: PlayerDto,
        var playerLost: PlayerDto,
        var timestamp: Long
)
