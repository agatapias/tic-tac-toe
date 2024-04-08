package pwr.edu.cloud.tictac.tictac.dto

import pwr.edu.cloud.tictac.tictac.entity.BoardItem

data class BoardDto(
        val id: Int? = null,
        val position: Int, // from 1 to 9
        val sign: Boolean? = null,
) {
    companion object {
        fun BoardItem.toBoardDto() = BoardDto(
                id = id,
                position = position,
                sign = sign
        )
    }
}