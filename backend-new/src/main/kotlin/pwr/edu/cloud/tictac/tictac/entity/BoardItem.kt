package pwr.edu.cloud.tictac.tictac.entity

import jakarta.persistence.*

@Entity
data class BoardItem(
        @Id
        @GeneratedValue(strategy = GenerationType.SEQUENCE)
        var id: Int? = null,
        var position: Int, // from 1 to 9
        var sign: Boolean? = null,
        @ManyToOne
        @JoinColumn(name = "match_id")
        var matchEntity: MatchEntity
)
