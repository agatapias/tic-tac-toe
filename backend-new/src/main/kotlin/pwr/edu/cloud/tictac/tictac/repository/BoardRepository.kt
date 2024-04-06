package pwr.edu.cloud.tictac.tictac.repository

import pwr.edu.cloud.tictac.tictac.entity.BoardItem
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BoardRepository : JpaRepository<BoardItem, Int> {
    fun findAllByMatchId(matchId: Int): List<BoardItem>
    fun findAllByMatchIdAndPosition(matchId: Int, position: Int): List<BoardItem>
}