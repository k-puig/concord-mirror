package net.kpuig.shoebill.backend.datamodels.channel;

import lombok.Data;

@Data
public class GetChannelResponse {
    private Long id;
    private Long position;
    private ChannelType type;
    private String name;
}
