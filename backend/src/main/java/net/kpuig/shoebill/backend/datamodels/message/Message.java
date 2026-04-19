package net.kpuig.shoebill.backend.datamodels.message;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;
import net.kpuig.shoebill.backend.datamodels.channel.Channel;
import net.kpuig.shoebill.backend.datamodels.userprofile.UserProfile;

@Data
@Entity(name = "message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String content;

    private Long timestamp;

    @OneToOne
    private Message replyTo;

    @ManyToOne
    private UserProfile userProfile;

    @ManyToOne
    private Channel channel;
}
