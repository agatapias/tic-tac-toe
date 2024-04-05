package lab.pwr.edu.tictac.entity

import jakarta.persistence.*
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

@Entity
data class BoardItem(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Int? = null,
        var position: Int, // from 1 to 9
        var value: Boolean? = null,
        @ManyToOne
        @JoinColumn(name = "match_id")
        @OnDelete(action = OnDeleteAction.CASCADE)
        var match: Match
)
