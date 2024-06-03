package pwr.edu.cloud.tictac.tictac.repository

import pwr.edu.cloud.tictac.tictac.entity.MatchEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MatchRepository : JpaRepository<MatchEntity, Int> {
}