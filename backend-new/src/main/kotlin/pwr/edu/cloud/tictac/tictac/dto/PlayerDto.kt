package pwr.edu.cloud.tictac.tictac.dto

import pwr.edu.cloud.tictac.tictac.entity.Player

data class PlayerDto(
        val name: String,
        val displayName: String
) {
    companion object {
        fun Player.toDto() = PlayerDto(
                name = name,
                displayName = displayName
        )
    }
}
