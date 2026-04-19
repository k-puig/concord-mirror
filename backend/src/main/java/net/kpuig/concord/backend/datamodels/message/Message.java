package net.kpuig.concord.backend.datamodels.message;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import net.kpuig.concord.backend.datamodels.channel.Channel;
import net.kpuig.concord.backend.datamodels.userprofile.UserProfile;

@Data
@Entity(name = "message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String content;

    private Long timestamp;

    @ManyToOne
    private UserProfile userProfile;

    @ManyToOne
    private Channel channel;
}
