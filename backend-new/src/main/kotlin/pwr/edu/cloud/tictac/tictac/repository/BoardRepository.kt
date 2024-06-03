package pwr.edu.cloud.tictac.tictac.repository

import pwr.edu.cloud.tictac.tictac.entity.BoardItem
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BoardRepository : JpaRepository<BoardItem, Int> {
    fun findAllByMatchEntityId(matchId: Int): List<BoardItem>
    fun findAllByMatchEntityIdAndPosition(matchId: Int, position: Int): List<BoardItem>
}