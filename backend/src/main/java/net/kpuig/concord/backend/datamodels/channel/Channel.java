package net.kpuig.concord.backend.datamodels.channel;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import net.kpuig.concord.backend.datamodels.server.Server;

@Data
@Entity(name = "channel")
public class Channel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long position;

    private ChannelType type;

    private String name;

    @ManyToOne
    private Server server;
}
