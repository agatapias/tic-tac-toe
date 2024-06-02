package pwr.edu.cloud.tictac.tictac.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import pwr.edu.cloud.tictac.tictac.entity.BoardItem
import pwr.edu.cloud.tictac.tictac.entity.MatchHistory
import pwr.edu.cloud.tictac.tictac.entity.Player

interface MatchHistoryRepository : JpaRepository<MatchHistory, Int> {
    @Query(value = "SELECT * " +
            "FROM history WHERE player_won_id = :user OR player_lost_id = :user", nativeQuery = true)
    fun findAllByUser(@Param("user") user: Int): List<MatchHistory>
}